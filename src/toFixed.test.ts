import { describe, expect, it } from 'vitest';

import { toFixed } from './toFixed';

describe('toFixed', () => {
  it('handles real-world cases', () => {
    // Porto
    expect(toFixed(152.9635604395604)).toEqual('152.96'); // Bolls
    expect(toFixed(138.58252747252746)).toEqual('138.58'); // Josi
    expect(toFixed(0.0045512820512669805)).toEqual('0.00'); // thies
    expect(toFixed(0.0028846153846302514)).toEqual('0.00'); // Jan-Luca
    expect(toFixed(5.684341886080802e-14)).toEqual('0.00'); // Elina
    expect(toFixed(2.842170943040401e-14)).toEqual('0.00'); // Timon
    expect(toFixed(-0.0004725274724535211)).toEqual('0.00'); // Henk
    expect(toFixed(-0.006963369963386867)).toEqual('-0.01'); // Jannis
    expect(toFixed(-10.027912087912028)).toEqual('-10.03'); // Moritz
    expect(toFixed(-10.095448717948727)).toEqual('-10.10'); // Ole
    expect(toFixed(-69.00063919413921)).toEqual('-69.00'); // Robert
    expect(toFixed(-83.36747252747253)).toEqual('-83.37'); // Schicke
    expect(toFixed(-119.05461538461536)).toEqual('-119.05'); // Fiona
    // rom sache
    expect(toFixed(3.178355599154145)).toEqual('3.18'); // das institut
    expect(toFixed(-0.004999999999967031)).toEqual('-0.00'); // florian
    expect(toFixed(-0.3749999999999716)).toEqual('-0.38'); // jannis
    expect(toFixed(-0.7550000000000239)).toEqual('-0.76'); // linus
    expect(toFixed(-2.0433555991541823)).toEqual('-2.04'); // lukas
    // Hamburgische Sackvereinigung
    expect(toFixed(92.24190476190476)).toEqual('92.24'); // Linus
    expect(toFixed(44.141904761904755)).toEqual('44.14'); // Jannis
    expect(toFixed(20.17857142857143)).toEqual('20.18'); // Lucer
    expect(toFixed(10.446571428571424)).toEqual('10.45'); // Josey
    expect(toFixed(9.695238095238096)).toEqual('9.70'); // Oler
    expect(toFixed(-8.321428571428571)).toEqual('-8.32'); // Sinjer
    expect(toFixed(-10.832)).toEqual('-10.83'); // thies
    expect(toFixed(-13.333333333333336)).toEqual('-13.33'); // Lauren
    expect(toFixed(-17.9)).toEqual('-17.90'); // Timon
    expect(toFixed(-33.415333333333336)).toEqual('-33.42'); // Adrianer
    expect(toFixed(-45.23676190476191)).toEqual('-45.24'); // L2
    expect(toFixed(-47.665333333333336)).toEqual('-47.67'); // Robbart
    // La Famiglia aber besser
    expect(toFixed(127.70500000000004)).toEqual('127.70'); // Leonard
    expect(toFixed(21.985000000000007)).toEqual('21.98'); // Oskar
    expect(toFixed(118.08833333333325)).toEqual('118.09'); // Laurin
    expect(toFixed(14.049999999999997)).toEqual('14.05'); // Lennart
    expect(toFixed(0.27500000000009095)).toEqual('0.28'); // Felix
    expect(toFixed(0)).toEqual('0.00'); // Jonas
    expect(toFixed(-26.00000000000003)).toEqual('-26.00'); // Raphael
    expect(toFixed(-27.265)).toEqual('-27.26'); // Florian
    expect(toFixed(-27.99000000000001)).toEqual('-27.99'); // Victor
    expect(toFixed(-200.84833333333324)).toEqual('-200.85'); // Linus
    // Krakau Abfehrt
    expect(toFixed(9.722198619111396)).toEqual('9.72'); // Ole
    expect(toFixed(4.286363636363319)).toEqual('4.29'); // Timon
    expect(toFixed(0.9817010346040433)).toEqual('0.98'); // Linus
    expect(toFixed(1.1368683772161603e-13)).toEqual('0.00'); // Thies
    expect(toFixed(1.1368683772161603e-13)).toEqual('0.00'); // Laurin
    expect(toFixed(1.1368683772161603e-13)).toEqual('0.00'); // Elina
    expect(toFixed(1.1368683772161603e-13)).toEqual('0.00'); // Jannis
    expect(toFixed(5.684341886080802e-14)).toEqual('0.00'); // Jan-Luca
    expect(toFixed(5.684341886080802e-14)).toEqual('0.00'); // Robert
    expect(toFixed(5.684341886080802e-14)).toEqual('0.00'); // Josephine
    expect(toFixed(0)).toEqual('0.00'); // Raphael
    expect(toFixed(0)).toEqual('0.00'); // Jonas
    expect(toFixed(-4.547473508864641e-13)).toEqual('0.00'); // Linus
    expect(toFixed(-1.0076589472588466)).toEqual('-1.01'); // Leonard
    expect(toFixed(-4.2604057237088)).toEqual('-4.26'); // Das Institut
    expect(toFixed(-9.722198619111396)).toEqual('-9.72'); // Moritz
    // Die Reise (beheizter Pool)
    expect(toFixed(0.0036262200350165585)).toEqual('0.00'); // Laurin
    expect(toFixed(0.0025929625928711175)).toEqual('0.00'); // Adriana
    expect(toFixed(0.0025929625928711175)).toEqual('0.00'); // Linus S
    expect(toFixed(1.7053025658242404e-13)).toEqual('0.00'); // Josephine
    expect(toFixed(0)).toEqual('0.00'); // Linus B
    expect(toFixed(0)).toEqual('0.00'); // Thies
    expect(toFixed(-5.684341886080802e-14)).toEqual('0.00'); // Jonas
    expect(toFixed(-5.684341886080802e-14)).toEqual('0.00'); // Robert
    expect(toFixed(-1.1368683772161603e-13)).toEqual('0.00'); // Joel
    expect(toFixed(-3.410605131648481e-13)).toEqual('0.00'); // Johannes
    expect(toFixed(-0.00024379883507208433)).toEqual('0.00'); // Elina
    expect(toFixed(-0.0021734763996050788)).toEqual('0.00'); // Ole
    expect(toFixed(-0.002592962593325865)).toEqual('0.00'); // Timon
    expect(toFixed(-0.003801907393210513)).toEqual('0.00'); // Moritz
  });
});
