<div id="badges" align="center"></div>

# docker-compose-backup

## Restore a compose.io backup into a Docker container

### What is docker-compose-backup?

This tool will access compose.io backups for a deployment, retrieve the latest backup tarball, and extract it to a path of your choosing.

The most prominent use-case, and the reason why we built this tool, is to bootstrap development containers with potentially large data-sets in the most timely manner possible.

### Installation

`docker pull radify/compose-backup`

### Usage

compose-backup depends on the following environment variables being set:

- `COMPOSE_TOKEN`   - Your Personal Access Token on compose.io - get one from your [compose.io dashboard](https://app.compose.io/settings/oauth/access_tokens)
- `ACCOUNT_SLUG`    - Your compose.io account slug
- `DEPLOYMENT_NAME` - The name of your compose.io deployment (**not** the name of a database within that deployment)
- `OUTPUT_PATH`     - The path that the retrieved database should be extracted to (typically something like `/data/db`)

Then, you can invoke the tool against an existing database's data volume, like so:

```
docker run --volumes-from=<YOUR_DATABASE_CONTAINER_NAME> \
	-e COMPOSE_TOKEN=<YOUR_REALLY_LONG_COMPOSE_ACCESS_TOKEN> \
	-e ACCOUNT_SLUG=<YOUR-ACCOUNT-NAME> \
	-e DEPLOYMENT_NAME=<YOUR-DEPLOYMENT-NAME>
	-e OUTPUT_PATH=/data/db \
	radify/compose-backup
```

### Changelog

This project adheres to [Semantic Versioning](http://semver.org/). For a list of detailed changes, please refer to [CHANGELOG.md](CHANGELOG.md).

### Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md).

### License

compose-backup is released under the [BSD 3-clause “New” License](LICENSE).
