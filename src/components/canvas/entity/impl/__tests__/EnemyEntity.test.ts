import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EnemyEntity } from '../EnemyEntity';
import { PokemonCard } from '../cardEntity';
import { GameActive } from '../../../GameActive';

describe('EnemyEntity', () => {
    let mockPokemonCard: PokemonCard;

    beforeEach(() => {
        mockPokemonCard = {
            name: 'TestEnemy',
            value: 5,
            image: 'enemy.png',
            evolvedFrom: null,
            evolvesTo: [],
            types: [{ type: { name: 'fire' } }],
            entity: null
        };
    });

    it('should initialize with correct HP based on value and difficulty', () => {
        const difficulty = 0;
        const enemy = new EnemyEntity(0, 0, 100, 100, mockPokemonCard, difficulty);

        // HP = value * 10 * (difficulty + 1)
        // 5 * 10 * 1 = 50
        expect(enemy.hp).toBe(50);
        expect(enemy.maxHp).toBe(50);

        const hardEnemy = new EnemyEntity(0, 0, 100, 100, mockPokemonCard, 1);
        // 5 * 10 * 2 = 100
        expect(hardEnemy.hp).toBe(100);
    });

    it('should take damage correctly', () => {
        const enemy = new EnemyEntity(0, 0, 100, 100, mockPokemonCard, 0);
        const initialHp = enemy.hp;

        enemy.damage(10);

        expect(enemy.hp).toBe(initialHp - 10);
        expect(enemy.damageTaken).toBe(10);
        expect(enemy.damageTakenDisplayDelay).toBe(5);
    });

    it('should return false for deathCheck when HP > 0', () => {
        const enemy = new EnemyEntity(0, 0, 100, 100, mockPokemonCard, 0);
        expect(enemy.deathCheck()).toBe(false);
    });

    it('should return true for deathCheck when HP <= 0 and spawn corpse', () => {
        const enemy = new EnemyEntity(0, 0, 100, 100, mockPokemonCard, 0);

        // Mock GameActive
        const mockGame = {
            addEntity: vi.fn(),
            removeEntity: vi.fn(), // Needed because CorpseEntity calls destroy() on the original entity
            t: 0
        } as unknown as GameActive;

        enemy.setGame(mockGame);

        enemy.damage(50); // Kill it
        expect(enemy.hp).toBe(0);

        const isDead = enemy.deathCheck();
        expect(isDead).toBe(true);
        expect(mockGame.addEntity).toHaveBeenCalled();
        expect(mockGame.removeEntity).toHaveBeenCalledWith(enemy);
    });

    it('should update damageTaken over time', () => {
        const enemy = new EnemyEntity(0, 0, 100, 100, mockPokemonCard, 0);
        enemy.damage(10);

        // Wait for delay to pass
        enemy.damageTakenDisplayDelay = 0;

        // Mock game for update
        const mockGame = { t: 0 } as unknown as GameActive;
        enemy.setGame(mockGame);

        // Simulate update
        enemy.update(0.1);

        // damageTaken should decrease towards 0
        expect(enemy.damageTaken).toBeLessThan(10);
    });
});
