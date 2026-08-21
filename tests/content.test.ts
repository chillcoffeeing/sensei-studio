import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CLIENTS, HERO, PROJECTS, SITE } from '../src/data/content'

const PUBLIC_DIR = resolve(fileURLToPath(new URL('.', import.meta.url)), '../public')

describe('SITE', () => {
  it('tiene nombre y tagline no vacíos', () => {
    expect(SITE.name.trim()).not.toBe('')
    expect(SITE.tagline.trim()).not.toBe('')
  })
})

describe('HERO', () => {
  it('declara ambos CTAs con texto y href', () => {
    for (const cta of [HERO.ctaPrimary, HERO.ctaSecondary]) {
      expect(cta.text.trim()).not.toBe('')
      expect(cta.href.trim()).not.toBe('')
    }
  })
})

describe('CLIENTS', () => {
  it('cada logo existe como archivo bajo public/', () => {
    expect(CLIENTS.length).toBeGreaterThan(0)
    for (const client of CLIENTS) {
      const assetPath = resolve(PUBLIC_DIR, client.logo.replace(/^\//, ''))
      expect(
        existsSync(assetPath),
        `Logo de ${client.name} no encontrado: ${client.logo}`
      ).toBe(true)
    }
  })
})

describe('PROJECTS', () => {
  it('cada imagen existe como archivo bajo public/ y tiene alt', () => {
    expect(PROJECTS.length).toBeGreaterThan(0)
    for (const project of PROJECTS) {
      const assetPath = resolve(PUBLIC_DIR, project.image.replace(/^\//, ''))
      expect(
        existsSync(assetPath),
        `Imagen de "${project.title}" no encontrada: ${project.image}`
      ).toBe(true)
      expect(project.alt.trim()).not.toBe('')
    }
  })
})
