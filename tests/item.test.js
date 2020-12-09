import dotenv from 'dotenv'
dotenv.config()

jest.setTimeout(1000 * 60 * 1)
let warehouseID
let storageID

// Login and create a warehouse with a storage before all test
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
  warehouseID = page.url().split('/').pop()
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
  storageID = page.url().split('/').pop()

  await expect(page.url()).not.toBe(`http://localhost:3000/warehouse/${warehouseID}/storage/new`)
  await expect(page.url()).toContain(`http://localhost:3000/warehouse/${warehouseID}/storage/${storageID}`)
  await expect(page).toHaveText('div', storageName)
})

describe('item', () => {
  it('should allow to view the new item page', async () => {
    await page.goto(`http://localhost:3000/warehouse/${warehouseID}/storage/${storageID}/item/new`)
    await expect(page).toHaveText('h2', 'Create Item')
  })

  it('should deny to create new item with invalid data', async () => {
    await page.goto(`http://localhost:3000/warehouse/${warehouseID}/storage/${storageID}/item/new`)
    await page.waitForTimeout(1000)

    await page.fill('[name="sizeX"]', '10')
    await page.fill('[name="sizeY"]', '50')
    await page.fill('[name="sizeZ"]', '10')

    await page.fill('[name="positionX"]', '10')
    await page.fill('[name="positionY"]', '50')
    await page.fill('[name="positionZ"]', '50')
    await page.click('[type=submit]')

    await expect(page.url()).toBe(`http://localhost:3000/warehouse/${warehouseID}/storage/${storageID}/item/new`)
    await expect(page).toHaveText('div', 'name is a required field')

  })

  it('should allow to create new item with valid data', async () => {
    const itemName = 'Item name'

    await page.fill('[name="name"]', itemName)

    await page.fill('[name="value"]', '1000')

    await page.fill('[name="sizeX"]', '10')
    await page.fill('[name="sizeY"]', '50')
    await page.fill('[name="sizeZ"]', '10')

    await page.fill('[name="positionX"]', '10')
    await page.fill('[name="positionY"]', '50')
    await page.fill('[name="positionZ"]', '50')

    await page.click('[type=submit]')

    await page.waitForTimeout(3000)
    let itemID = page.url().split('/').pop()
   
    await expect(page.url()).not.toBe(`http://localhost:3000/warehouse/${warehouseID}/storage/${storageID}/item/new`)
    await expect(page.url()).toBe(`http://localhost:3000/warehouse/${warehouseID}/storage/${storageID}/item/${itemID}`)
    await expect(page).toHaveText('div', itemName)
  })
})
