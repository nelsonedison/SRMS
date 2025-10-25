@echo off
echo Setting up Django project...

REM Create virtual environment
python -m venv venv

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install requirements
pip install -r requirements.txt

REM Run migrations
python manage.py makemigrations
python manage.py migrate

REM Create superuser (optional)
echo.
echo To create a superuser, run: python manage.py createsuperuser
echo To start the server, run: python manage.py runserver

echo.
echo Setup complete! Virtual environment is activated.
echo To activate it later, run: venv\Scripts\activate.bat