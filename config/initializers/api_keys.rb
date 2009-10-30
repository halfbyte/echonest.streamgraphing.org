class SiteConfig
  API_KEYS = YAML.load_file(File.join(Rails.root, "config", "api_keys.yml"))
end