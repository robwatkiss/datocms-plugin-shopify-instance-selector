# Shopify Instance Selector

A DatoCMS plugin that allows editors to search and select Shopify resources (products, variants, collections) directly within DatoCMS JSON fields.

This plugin is built using the [DatoCMS Plugin SDK](https://www.datocms.com/docs/plugin-sdk/introduction) and wouldn't be possible without the [Shopify Product DatoCMS Plugin](https://github.com/datocms/plugins/tree/master/shopify-product) as a reference.

## Why This Exists

Managing e-commerce content across multiple platforms can be challenging. This plugin bridges the gap between DatoCMS and Shopify by:

- Enabling direct Shopify resource selection within DatoCMS
- Preventing manual copying and pasting of Shopify IDs
- Reducing errors through visual confirmation of selected items

## Requirements

- DatoCMS project
- Shopify store
- Shopify Storefront API access token
- Shopify store URL

## Installation

1. Add the plugin to your DatoCMS project
2. Configure the plugin with your Shopify credentials:
   - Storefront URL (e.g., `https://your-store.myshopify.com`)
   - Storefront Access Token

## Supported Models

The plugin supports the following Shopify resources:

- **Products**: Search and select Shopify products
- **Product Variants**: Search and select specific variants of products
- **Collections**: Search and select product collections

Further resource types may be added in the future and can be requested via the [issue tracker](https://github.com/robwatkiss/datocms-plugin-shopify-instance-selector/issues).

## Usage

1. Create a JSON field in your DatoCMS model
2. Set the field appearance to "Shopify Instance Selector"
3. Configure the field to specify which type of Shopify resource it should handle
4. Use the field in your content to search and select Shopify resources

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:

1. Check the existing issues
2. Create a new issue with a detailed description
3. Provide steps to reproduce any problems

## About

Created and maintained by Rob Watkiss. For more information about DatoCMS plugins, visit the [DatoCMS documentation](https://www.datocms.com/docs/plugin-sdk/introduction).