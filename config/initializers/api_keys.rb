class SiteConfig
  if File.exists?(File.join(Rails.root, "config", "api_keys.yml"))
    api_keys = YAML.load_file(File.join(Rails.root, "config", "api_keys.yml"))
    ECHONEST_KEY = api_keys['echonest']
  else
    ECHONEST_KEY = ENV['ECHONEST_API_KEY']
  end
end