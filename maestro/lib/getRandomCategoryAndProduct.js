function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomIndex(length) {
  return Math.floor(Math.random() * length)
}

const CateGoriesAndProducts = [
  {
    name: 'Gaming',
    products: [
      {
        name: 'Nintendo Switch',
        slug: 'nintendo-switch',
        price: 299,
      },
      {
        name: 'Nintendo Switch Lite',
        slug: 'nintendo-switch-lite',
        price: 199,
      },
      {
        name: 'Ps5',
        slug: 'ps5',
        price: 499,
      },
      {
        name: 'Nintendo Switch Oled',
        slug: 'nintendo-switch-oled',
        price: 349,
      },
    ],
  },
  {
    name: 'Laptops',
    products: [
      {
        name: 'Dell',
        slug: 'dell',
        price: 999,
      },
      {
        name: 'Mac Book Air',
        slug: 'mac-book-air',
        price: 1099,
      },

      {
        name: 'Mac Book Pro',
        slug: 'mac-book-pro',
        price: 1599,
      },
    ],
  },
  {
    name: 'HeadPhones',
    products: [
      {
        name: 'HeadSet Sony',
        slug: 'headset-sony',
        price: 499,
      },
      {
        name: 'AirPod Pro2',
        slug: 'airpod-pro2',
        price: 249,
      },
    ],
  },
  {
    name: 'Phones',
    products: [
      {
        name: 'Iphone 16',
        slug: 'iphone-16',
        price: 799,
      },
      {
        name: 'Samsung Galaxy s24',
        slug: 'samsung-galaxy-s24',
        price: 759,
      },
      {
        name: 'Iphone 16 Pro',
        slug: 'iphone-16-pro',
        price: 899,
      },
    ],
  },
]

const randomCategory =
  CateGoriesAndProducts[getRandomIndex(CateGoriesAndProducts.length)]
const randomProduct =
  randomCategory.products[getRandomIndex(randomCategory.products.length)]
const buyCount = getRandomNumber(2, 4)

output.category = {
  randomCategory: randomCategory,
  randomProduct: randomProduct,
  productTitleText: `Title: ${randomProduct.name}`,
  productSlugText: `Slug: ${randomProduct.slug}`,
  productPriceText: `Unit Price: $${randomProduct.price.toFixed(2)}`,
  buyCount: buyCount,
  detailTotalPriceText: `Total Price: $${(
    randomProduct.price * buyCount
  ).toFixed(2)}`,
  cartTotalPriceText: `Total: $${(randomProduct.price * buyCount).toFixed(2)}`,
}
