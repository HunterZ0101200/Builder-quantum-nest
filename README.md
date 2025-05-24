# ShopFusion E-commerce

A full-featured e-commerce website built with Django and vanilla JavaScript.

## Features

- Product catalog with categories
- Product search functionality
- Shopping cart using Django sessions
- Checkout process
- Responsive design

## Installation

1. Clone the repository

```
git clone <repository-url>
cd shopfusion
```

2. Create a virtual environment and activate it

```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies

```
pip install -r requirements.txt
```

4. Run migrations

```
python manage.py migrate
```

5. Create a superuser

```
python manage.py createsuperuser
```

6. Start the development server

```
python manage.py runserver
```

7. Visit http://127.0.0.1:8000/ in your browser

## Project Structure

- `shopfusion/` - Django project settings
- `shop/` - Main application with models, views, etc.
- `templates/` - HTML templates
- `static/` - CSS, JavaScript, and images
- `media/` - User-uploaded files (product images, etc.)

## Admin Interface

- Visit http://127.0.0.1:8000/admin/ to manage products, categories, and orders

## Adding Products

1. Log in to the admin interface
2. Create categories
3. Add products with images, descriptions, and prices

## License

[MIT License](LICENSE)
