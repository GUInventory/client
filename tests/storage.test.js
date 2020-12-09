import dotenv from 'dotenv'
dotenv.config()

jest.setTimeout(1000 * 60 * 1)
let warehouseID

// Login and create a warehouse before all test
beforeAll(async () => {
  await page.goto("http://localhost:3000/auth/login");
  await page.waitForTimeout(1000)
  await page.fill('[name="email"]', process.env.TEST_USERNAME)
  await page.fill('[name="password"]', process.env.TEST_PASSWORD)
  await page.click('[type=submit]')
  await page.waitForTimeout(1000)

  const warehouseName = 'Warehouse for storage test'

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
  warehouseID = page.url().split('/').pop()
})

describe('storage', () => {
  it('should allow to view the new storage page', async () => {
    await page.goto(`http://localhost:3000/warehouse/${warehouseID}/storage/new`)
    await expect(page).toHaveText('h2', 'Create Storage')
  })

  it('should deny to create new storage with invalid data', async () => {
    await page.goto(`http://localhost:3000/warehouse/${warehouseID}/storage/new`)

    await page.fill('[name="sizeX"]', '120')
    await page.fill('[name="sizeY"]', '500')
    await page.fill('[name="sizeZ"]', '25')

    await page.fill('[name="positionX"]', '120')
    await page.fill('[name="positionY"]', '500')
    await page.click('[type=submit]')

    await expect(page.url()).toBe(`http://localhost:3000/warehouse/${warehouseID}/storage/new`)
    await expect(page).toHaveText('div', 'name is a required field')

  })

  it('should allow to create new storage with valid data', async () => {
    const storageName = 'Storage create test'
    await page.goto(`http://localhost:3000/warehouse/${warehouseID}/storage/new`)

    await page.fill('[name="name"]', storageName)
    await page.fill('[name="sizeX"]', '120')
    await page.fill('[name="sizeY"]', '500')
    await page.fill('[name="sizeZ"]', '25')

    await page.fill('[name="positionX"]', '120')
    await page.fill('[name="positionY"]', '500')
    await page.click('[type=submit]')

    await page.waitForTimeout(1000)
    let storageID = page.url().split('/').pop()
    
    await expect(page.url()).not.toBe(`http://localhost:3000/warehouse/${warehouseID}/storage/new`)
    await expect(page.url()).toBe(`http://localhost:3000/warehouse/${warehouseID}/storage/${storageID}`)
    await expect(page).toHaveText('div', storageName)
  })
})
