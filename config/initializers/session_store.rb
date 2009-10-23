# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_streamgraphing_session',
  :secret      => '992fda5fad762a734c93c4e14721f8c8d620ddb4f58666a4c0f1a01a3ba0fc88fb0cdf88e85485ae5aeff2f9172c992cd72305b3cb2ded35e9938212b8bb9d6b'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
