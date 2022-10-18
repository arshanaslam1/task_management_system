# syntax=docker/dockerfile:1
FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt install pylint

# set work directory
WORKDIR /backend


# install dependencies
RUN pip install --upgrade pip
COPY requirements.txt /backend/
RUN pip install -r requirements.txt

# copy project
COPY . /backend/
#RUN python manage.py migarate