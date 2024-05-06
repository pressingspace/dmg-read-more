<?php
/**
 * WP-CLI commands for dmg/read-more block.
 */
class DMG_ReadMoreCLI extends WP_CLI_Command {
  /**
   * Search for posts containing the dmg/read-more block.
   *
   * If dates are omitted, the search defaults to the last 30 days.
   * ## OPTIONS
   *
   * [--date-before]
   * : Date to retrieve posts before. Accepts strtotime()-compatible string.
   *
   * [--date-after]
   * : Date to retrieve posts after. Accepts strtotime()-compatible string.
   */
  function search( $args, $assoc_args ) {
    /**
     * For performant LIKE queries can we call `wp db query` from our own CLI command?
     *
     * Something like this:
     *
     * npm run env run cli wp db query 'select id from wp_posts where post_content like "%<!-- wp:dmg/read-more %" AND post_status="publish"'
     *
     * Alternatively filter wp_query for our CLI command using
     * https://developer.wordpress.org/reference/hooks/pre_get_posts/
     **/
    $query_params = [
        'post_type' => 'any',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => 'ID',
        'depth' => 1,
        'order' => 'ASC',
        'fields' => 'ids',
    ];

    $date_query = [];

    if ( ! empty( $assoc_args['date-before'] ) ) {
        $date_query['before'] = $assoc_args['date-before'];
    }

    if ( ! empty( $assoc_args['date-after'] ) ) {
        $date_query['after'] = $assoc_args['date-after'];
    }

    if ( empty( $date_query) ) {
        $date_query['before'] = 'today';
        $date_query['after']  = 'today - 30 days';
    }

    $query_params['date_query'] = $date_query;

    /**
     * @todo switch WIP "?s" query for MySQL LIKE query on post content
     * (there is no need to search posts titles)
     *
     * e.g. filter wp_query for our CLI command using
     * https://developer.wordpress.org/reference/hooks/pre_get_posts/
     */
    $query_params['s'] = '<!-- wp:dmg/read-more ';

    // WP_CLI::line( print_r($query_params, 1) );

    // @todo Exit with error if date range exceeds 30 days

    $query = new WP_Query($query_params);

    $post_ids = $query->posts;

    // @todo handle query errors

    if (count($post_ids)) {
        WP_CLI::line( implode(',', $post_ids) );
    } else {
        WP_CLI::line( '0 posts found.' );
    }
  }
}

WP_CLI::add_command( 'dmg-read-more', 'DMG_ReadMoreCLI' );
