<?php
/**
 * WP-CLI commands for the dmg/read-more block.
 */
class DMG_ReadMoreCLI extends WP_CLI_Command
{
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
     * Initial WP_Query params that we will adjust later with a filter.
     *
     * @todo optimise further because ['post_type' => 'any'] includes 'attachment'
     **/
    $query_params = [
        'post_type' => 'any',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => 'ID',
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

    if ( empty( $date_query ) ) {
        $date_query['before'] = 'tomorrow';
        $date_query['after']  = 'tomorrow - 30 days';
    }

    // @todo Consider limiting date query to a max length e.g. 365 days
    $query_params['date_query'] = $date_query;

    /**
     * @todo switch WIP "?s" query for MySQL LIKE query on post content
     * (there is no need to search posts titles)
     *
     * e.g. filter wp_query for our CLI command using
     * https://developer.wordpress.org/reference/hooks/pre_get_posts/
     */
    $filterQuery = function( $where, \WP_Query $query ) {
        global $wpdb;
        $where .= ' AND (' . esc_sql( $wpdb->posts ) . '.post_content LIKE \'%<!-- wp:dmg/read-more %\')';
        return $where;
    };

    add_filter( 'posts_where', $filterQuery, 10, 2 );

    $query = new WP_Query( $query_params );

    // WP_CLI::line( $query->request );

    remove_filter( 'posts_where', $filterQuery, 10, 2 );

    $post_ids = $query->posts;

    // @todo handle query errors

    if ( count( $post_ids ) ) {
        WP_CLI::line( implode( ',', $post_ids ) );
    } else {
        WP_CLI::line( '0 posts found.' );
    }
  }
}

WP_CLI::add_command( 'dmg-read-more', 'DMG_ReadMoreCLI' );