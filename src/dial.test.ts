import assert from 'node:assert/strict'
import { test } from 'node:test'
import { angleDelta, clock, project, resist, snap, tempoFor } from './dial.ts'

test('project: a 60 min/s flick travels about 30 minutes', () => {
  assert.ok(Math.abs(project(60) - 29.94) < 0.1)
  assert.equal(project(0), 0)
})
test('resist: inside the range is 1:1, outside is damped and monotonic', () => {
  assert.equal(resist(30), 30)
  assert.ok(resist(70) > 60 && resist(70) < 70)
  assert.ok(resist(80) > resist(70))
  assert.ok(resist(0) < 5 && resist(0) > 0)
})
test('snap: nearest 5 minutes, clamped', () => {
  assert.equal(snap(27), 25)
  assert.equal(snap(28), 30)
  assert.equal(snap(-10), 5)
  assert.equal(snap(99), 60)
})
test('angleDelta wraps over the top of the dial', () => {
  assert.equal(angleDelta(5, 355), 10)
  assert.equal(angleDelta(355, 5), -10)
})
test('names and clock', () => {
  assert.equal(tempoFor(25), 'Andante')
  assert.equal(tempoFor(30), 'Custom')
  assert.equal(clock(1499.2), '25:00')
  assert.equal(clock(0), '00:00')
})
