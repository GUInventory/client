import dotenv from 'dotenv'
dotenv.config()

jest.setTimeout(1000 * 60 * 1)

// Login before all test
beforeAll(async () => {
  await page.goto("http://localhost:3000/auth/login");
  await page.waitForTimeout(1000)
  await page.fill('[name="email"]', process.env.TEST_USERNAME)
  await page.fill('[name="password"]', process.env.TEST_PASSWORD)
  await page.click('[type=submit]')
  await page.waitForTimeout(1000)
})

describe('warehouse', () => {
  it('should allow to view new warehouse page', async () => {
    await page.goto('http://localhost:3000/')
    await page.waitForTimeout(1000)

    await page.click('[aria-label="Add new warehouse"]')
    await page.waitForTimeout(1000)

    await expect(page.url()).toBe('http://localhost:3000/warehouse/new')
    await expect(page).toHaveText('h2', 'Create warehouse')
  })

  it('should deny to create new warehouse with not valid data', async () => {
    await page.goto('http://localhost:3000/warehouse/new')
    await page.waitForTimeout(1000)

    await page.fill('[name="sizeX"]', '1200')
    await page.fill('[name="sizeY"]', '5000')
    await page.fill('[name="sizeZ"]', '250')
    await page.click('[type=submit]')

    await expect(page.url()).toBe('http://localhost:3000/warehouse/new')
    await expect(page).toHaveText('div', 'name is a required field')

  })

  it('should allow to create new warehouse with valid data', async () => {
    const warehouseName = 'Warehouse create test'

    await page.goto('http://localhost:3000/warehouse/new')
    await page.waitForTimeout(1000)

    await page.fill('[name="name"]', warehouseName)
    await page.fill('[name="sizeX"]', '1200')
    await page.fill('[name="sizeY"]', '5000')
    await page.fill('[name="sizeZ"]', '250')
    await page.click('[type=submit]')

    await page.waitForTimeout(1000)

    await expect(page.url()).not.toBe('http://localhost:3000/warehouse/new')
    await expect(page.url()).toContain('http://localhost:3000/warehouse/')
    await expect(page).toHaveText('div', warehouseName)
  })
})
