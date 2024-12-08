const CateGoriesAndProducts = [
  {
    name: 'Gaming',
    products: [
      'Nintendo Switch',
      'Nintendo Switch Lite',
      'Ps5',
      'Nintendo Switch Oled',
    ],
  },
  {
    name: 'Laptops',
    products: ['Dell', 'Mac Book Air', 'Mac Book Pro'],
  },
  {
    name: 'HeadPhones',
    products: ['HeadSet Sony', 'AirPod Pro2'],
  },
  {
    name: 'Phones',
    products: ['Iphone 16', 'Samsung Galaxy s24', 'Iphone 16 Pro'],
  },
]
const randomIndex = Math.floor(Math.random() * CateGoriesAndProducts.length)
const randomCategory = CateGoriesAndProducts[randomIndex]

output.category = {
  randomCategory: randomCategory,
}
