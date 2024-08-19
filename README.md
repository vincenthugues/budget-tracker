# Budget Tracker

## Description

Budget tracking app using NestJS and React, with json-based YNAB data import and simple transactions/categories/etc. list views

## Dependencies

mongodb

## Run locally

- `yarn db:start`
- `yarn server:start:dev`
- `yarn client:start`

## Run tests

- `(cd server && yarn test)`
- `(cd client && yarn test)`

## To do

- budgeting
- improve test quality & coverage (hooks, components)
- reconciliation
- overspending
- auto budgeting
- recurrent & future transactions
- category group creation
- transactions pagination
- moving money from one category budget to another
- graphs/reports
- auth
- deployment
- month category budget info over time
