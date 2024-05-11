# dmg::media Read More

[![e2e tests](https://github.com/pressingspace/dmg-read-more/actions/workflows/e2e.yml/badge.svg)](https://github.com/pressingspace/dmg-read-more/actions/workflows/e2e.yml)
[![unit tests](https://github.com/pressingspace/dmg-read-more/actions/workflows/unit.yml/badge.svg)](https://github.com/pressingspace/dmg-read-more/actions/workflows/unit.yml)

[Brief](./docs/brief.md)

Please contact [stu@pressingspace.com](mailto:stu@pressingspace.com) for further discussion.

Kind regards,

Stu

## dmg/read-more block

* docs to follow...

## WP CLI command

Command:

```bash
wp dmg-read-more search
```

Command with date params:

```bash
wp dmg-read-more search --date-after="last Monday - 14 days" --date-before="last Monday"
```

## Setting up

```bash
npm run env start
```

## Tests

For the purposes of the the technical task I have added some example unit tests.

A production-ready app would have greater test coverage.

### Playwright e2e tests ###

```bash
npm run test:e2e
```

### Jest Unit tests ###

```bash
npm run test:unit
```

### PHPUnit tests ###

I could not find the time to add PHPUnit tests for this technical task.

Examples of PHPUnit tests I have written can be found in the BeyondWords wordpress plugin repo.

e.g. [PlayerTest](https://github.com/beyondwords-io/wordpress-plugin/blob/main/tests/phpunit/Core/PlayerTest.php), [MetaboxTest](https://github.com/beyondwords-io/wordpress-plugin/blob/main/tests/phpunit/Component/Post/Metabox/MetaboxTest.php).

## Submission notes

### 1. Posts search query

The brief states:

> search for and then choose a **published** post

To fulfil this requirement the search query currently returns posts with status: `publish`.

Allowing editors to select a post with a `future`, `draft` or `pending` state may be
preferable, to provide editors with more flexibility.

### 2. WP-CLI query optimisation

The following steps have been taken to keep WP CLI searches fast for large datasets:

1. Only search the `post_content` field for the string `<!-- wp:dmg/read-more `.
2. Only return the `id` field (primary key) in the search query.

## Suggested improvements

### 1. Search other post types

The brief states:

> search for and then choose a published **post**

The search query is currently restricted to searching posts of *the same post type*.
I assumed this would be the most suitable approach to begin with.

If the requirement is to only search *Posts* then we could hardcode the `type` query
param of the search query to `post`.

If there is a requirement to link *between* post types (e.g. from a `post` to a `page`)
then this could be achieved by adding a "Post type" selector above the search box. The
selected Post type would determine the `type` query param of the search query.

### 2. Block Placeholder

When the block is first added we could show a `Placeholder` with the post search control in it.

This optimisation would reduce the time required for editors to add this block, and make it clearer
that a post had not yet been selected when a block has no `linkedPostId` attribute.

### 3. WP-CLI search results

If 1,000s of posts are returned it can be difficult for users to copy the post IDs from STDOUT, and to
easily see the number of results returned and the date range (when no dates are supplied).

Improvements to consider are:

- Support a `--verbose` argument that adds the query dates, post type and a `Total results: ` line to the output.
- Support an `--output` argument to save the IDs to a file.
- Support pagination arguments such as `--page` and `--per-page` to split the results into smaller groups.
