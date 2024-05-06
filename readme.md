# dmg::media Read More

[Brief][./docs/brief.md]

Please contact [stu@pressingspace.com][mailto:stu@pressingspace.com] for further discussion.

Kind regards,

Stu

## Submission notes

### 1. Posts search query

The brief states:

> search for and then choose a **published** post

To fulfil this requirement the search query currently returns posts with status: `publish`.

Allowing editors to select a post with a `future`, `draft` or `pending` state may be
preferable, to provide editors with more flexibility.

### 2. WP-CLI query optimisation

The following steps have been taken to keep WP CLI searches fast for large datasets:

1. Search `post_content` for the string `<!-- wp:dmg/read-more `.
2. Only request the `id` field for the search request.

## Suggested improvements

### 1. Search other post types

The brief states:

> search for and then choose a published **post**

The search query is currently restricted to searching posts of *the same post type*.
I determined this would be the most suitable approach to begin with.

If the requirement is to only search Posts then this could be hardcoded to `post`.

If there is a requirement to link *between* post types (e.g. from a `post` to a `page`)
then this could be achieved by adding a "Post type" selector above the search box.

The selected Post type would determine the `type` query param of the search query.

### 2. Block Placeholder

When the block is first added we could show a `Placeholder` with the post search control in it.

This optimisation would reduce the time required for editors to add this block, and make it clearer that
a linked post had not been selected.

### 3. WP-CLI search results

If 1,000s of posts are returned it can be difficult for users to copy the post IDs from STDOUT.

Suggested improvements are:

- Support pagination arguments such as `--page` and `--per-page` to split the results into smaller groups.
- Support an `--output` argument to save the IDs to a file.
- Support a `--format` argument to present the IDs in a format that is easier to read (e.g. CSV with column headers).
