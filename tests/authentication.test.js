import dotenv from 'dotenv'
dotenv.config()

jest.setTimeout(1000 * 60 * 1)

describe('authentication', () => {
  it('should deny access to protected routes for unauthenticated request', async () => {
    await page.goto('http://localhost:3000/')
    await page.waitForTimeout(1000)
    await expect(page.url()).toBe('http://localhost:3000/auth/login')
  })

  it('should allow users to sign in and get an auth token and access protected routes', async () => {
    await page.goto('http://localhost:3000/auth/login')
    await page.waitForTimeout(1000)
    await page.fill('[name="email"]', process.env.TEST_USERNAME)
    await page.fill('[name="password"]', process.env.TEST_PASSWORD)
    await page.click('[type=submit]')

    await page.waitForTimeout(1000)
    await expect(page.url()).toBe('http://localhost:3000/')
    await expect(page).toHaveText('h2', 'Warehouses')
  })

  it('should redirect authenticated users to the index page', async () => {
    await page.goto('http://localhost:3000/auth/login')
    await page.waitForTimeout(1000)
    await expect(page.url()).toBe('http://localhost:3000/')
  })
})
