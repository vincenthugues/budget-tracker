# user
curl -H "Authorization: Bearer e7A6N_M8VsvvPsEJnNVFs9omWoRD5Qokb9Anj6mg5gI" -H "accept: application/json" -X GET "https://api.youneedabudget.com/v1/user"

# budget export
curl -H "Authorization: Bearer e7A6N_M8VsvvPsEJnNVFs9omWoRD5Qokb9Anj6mg5gI" -H "accept: application/json" -X GET "https://api.youneedabudget.com/v1/budgets/f39f7bb2-0cdc-4990-a2b0-4eaf37ecb94b"

# budget settings
curl -H "Authorization: Bearer e7A6N_M8VsvvPsEJnNVFs9omWoRD5Qokb9Anj6mg5gI" -H "accept: application/json" -X GET "https://api.youneedabudget.com/v1/budgets/f39f7bb2-0cdc-4990-a2b0-4eaf37ecb94b/settings"

# budget accounts
curl -H "Authorization: Bearer e7A6N_M8VsvvPsEJnNVFs9omWoRD5Qokb9Anj6mg5gI" -H "accept: application/json" -X GET "https://api.youneedabudget.com/v1/budgets/f39f7bb2-0cdc-4990-a2b0-4eaf37ecb94b/accounts"

# budget categories
curl -H "Authorization: Bearer e7A6N_M8VsvvPsEJnNVFs9omWoRD5Qokb9Anj6mg5gI" -H "accept: application/json" -X GET "https://api.youneedabudget.com/v1/budgets/f39f7bb2-0cdc-4990-a2b0-4eaf37ecb94b/categories"

# budget payees
curl -H "Authorization: Bearer e7A6N_M8VsvvPsEJnNVFs9omWoRD5Qokb9Anj6mg5gI" -H "accept: application/json" -X GET "https://api.youneedabudget.com/v1/budgets/f39f7bb2-0cdc-4990-a2b0-4eaf37ecb94b/payees"

# budget payee locations
curl -H "Authorization: Bearer e7A6N_M8VsvvPsEJnNVFs9omWoRD5Qokb9Anj6mg5gI" -H "accept: application/json" -X GET "https://api.youneedabudget.com/v1/budgets/f39f7bb2-0cdc-4990-a2b0-4eaf37ecb94b/payee_locations"

# budget months
curl -H "Authorization: Bearer e7A6N_M8VsvvPsEJnNVFs9omWoRD5Qokb9Anj6mg5gI" -H "accept: application/json" -X GET "https://api.youneedabudget.com/v1/budgets/f39f7bb2-0cdc-4990-a2b0-4eaf37ecb94b/months"

# budget transactions
curl -H "Authorization: Bearer e7A6N_M8VsvvPsEJnNVFs9omWoRD5Qokb9Anj6mg5gI" -H "accept: application/json" -X GET "https://api.youneedabudget.com/v1/budgets/f39f7bb2-0cdc-4990-a2b0-4eaf37ecb94b/transactions"

# budget scheduled transactions
curl -H "Authorization: Bearer e7A6N_M8VsvvPsEJnNVFs9omWoRD5Qokb9Anj6mg5gI" -H "accept: application/json" -X GET "https://api.youneedabudget.com/v1/budgets/f39f7bb2-0cdc-4990-a2b0-4eaf37ecb94b/scheduled_transactions"
