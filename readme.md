# dmg::media Read More

[![e2e tests](https://github.com/pressingspace/dmg-read-more/actions/workflows/e2e.yml/badge.svg)](https://github.com/pressingspace/dmg-read-more/actions/workflows/e2e.yml)
[![unit tests](https://github.com/pressingspace/dmg-read-more/actions/workflows/unit.yml/badge.svg)](https://github.com/pressingspace/dmg-read-more/actions/workflows/unit.yml)

[Brief](./docs/brief.md)

Please contact [stu@pressingspace.com](mailto:stu@pressingspace.com) for further discussion.

Kind regards,

Stu

## Quickstart

```bash
npm install
npm run env start
npm run start
```

Visit [localhost:8888](http://localhost:8888/wp-admin).

Username: `admin`
Password: `password`

## WP CLI command

Command:

```bash
wp dmg-read-more search
```

Command with date params:

```bash
wp dmg-read-more search --date-after="last Monday - 14 days" --date-before="last Monday"
```

## Tests

I have added a few example e2e and unit tests.

A production-ready app would have greater test coverage.

### Playwright e2e tests ###

These run fine locally, but more work is required to get them working in GitHub Actions.

```bash
npm run test:e2e
```

### Jest Unit tests ###

These work both locally and in GitHub Actions.

```bash
npm run test:unit
```

## Submission notes

Any quotes refer to [the brief](./docs/brief.md)

### 1. Posts search query

> search for and then choose a **published** post

To fulfil this requirement the search query currently returns posts with status: `publish`.

Allowing editors to select a post with a `future`, `draft` or `pending` state may be
preferable, to provide editors with more flexibility.

### 2. WP-CLI query optimisation

> Note that there may be tens of thousands of results.

The following steps have been taken to keep WP CLI searches fast for large datasets:

1. Only search the `post_content` field for the string `<!-- wp:dmg/read-more `.
2. Only return the `id` field (primary key) in the search query.

### 3. No PHPUnit tests ###

I could not find the time to add PHPUnit tests. Examples of PHPUnit tests I have
written for another plugin can be found in the BeyondWords wordpress plugin repo.

e.g. [PlayerTest](https://github.com/beyondwords-io/wordpress-plugin/blob/main/tests/phpunit/Core/PlayerTest.php), [MetaboxTest](https://github.com/beyondwords-io/wordpress-plugin/blob/main/tests/phpunit/Component/Post/Metabox/MetaboxTest.php).

### 4. Plugin ZIP workflow in GitHub Actions

This needs a fix, the `npm run plugin-zip` command is missing some files.

For submission I prepared the ZIP manually instead.

## Suggested improvements

### 1. Search other post types

> search for and then choose a published **post**

The search query is currently restricted to searching posts of *the same post type*.
I assumed this would be the most suitable approach to begin with.

If the requirement is to *only search "posts"* then we could hardcode the `type`
param of the search query to `post`.

If there is a requirement to link *between* post types (e.g. from a `post` to a `page`)
then this could be achieved by adding a "Post type" selector above the search box. The
selected Post type would determine the `type` query param of the search query.

Although it is technically possible, it is not recommended to search all post types
at once. This would have adverse effects on performance.

### 2. Consider useMemo() for linkedPost and searchedPosts

Preventing recalculation of `linkedPost` and `searchedPosts` may improve performance,
although WordPress does it's own caching so this may not make a difference.

This would be one of the first things to check when performance testing against
a large dataset on a staging environment.

### 3. WP-CLI search results

> Note that there may be tens of thousands of results.

Improvements to consider are:

- Support a `--verbose` argument that optionally adds the query dates, post type
and a `Total results: ` line to the output.
- Support an `--output` argument to save the IDs to a file.
- If performance is still an issue with large datasets then support pagination
arguments such as `--page` and `--per-page` to split the results into smaller groups.

### 4. Select all the text in the post selector on click

Selecting all text on click/immediately after searching would make it a little easier to
delete the search term and search again using the keyboard only, but it may annoy some
users who wish to edit their original term. User feedback/testing could be conducted before
considering this.

### 5. Improve icons

A few icons have been hastily used this demo - ideally branded custom icons
would be used for block to help users identify the block.
