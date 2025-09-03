@app
personal-site

@http
get /ping

@static
spa true
prune true
compression br

@aws
# profile default
region us-west-2
