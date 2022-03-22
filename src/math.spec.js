import { isEven } from './math'

describe('isEven', () => {
  it('should return true if given an even number', () => {
    // SUT (system under test)
    const result = isEven(2)

    // Assertion
    expect(result).toEqual(true)
  })

  it('should return false if given an odd number', () => {
    // SUT (system under test)
    const result = isEven(1)

    // Assertion
    expect(result).toEqual(false)
  })
})
