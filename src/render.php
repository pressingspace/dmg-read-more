<?php
/**
 * The brief states:
 *
 * > The anchor should be output within a `core/paragraph` block with a HTML
 * > CSS class of `dmg-read-more` added to it.
 *
 * It isn't clear why a `core/paragraph` needs to be used instead of some
 * standard `<p>...</p>` markup, but it may be because filters have been added
 * for block rendering, so I have used `parse_blocks` and `render_block` below
 * to wrap our `<a>` markup with a `core/paragraph` block.
 *
 * This should work with filters such as https://developer.wordpress.org/reference/hooks/render_block/
 * but it may not be what was intended in the brief. If this is not correct
 * then please clarify.
 *
 * If this isn't correct then an alternate approach may include the use of:
 *
 * $wrapper_attributes = get_block_wrapper_attributes([
 *   'class' => 'dmg-read-more',
 * ]);
 *
 * (The get_block_wrapper_attributes() approach was my first attempt,
 * before I noticed that the brief was asking for a `core/paragraph` block)
 */
if (! array_key_exists('linkedPostId', $attributes)) {
	return;
}

if (empty($attributes['linkedPostId'])) {
	return;
}

$post = get_post($attributes['linkedPostId']);

if (get_post_status($post) !== 'publish') {
	return;
}

$link = sprintf(
	'<a class="dmg-read-more" href="%s" title="%s">%s</a>',
	get_the_permalink($post),
	the_title_attribute(['post' => $post, 'echo' => false]),
	esc_html(get_the_title($post))
);

$prefixed_link = sprintf(
	'%s: %s',
	__('Read more', 'dmg-read-more'),
	$link
);

$blocks = parse_blocks(
	sprintf(
		'<!-- wp:paragraph --><p>%s</p><!-- /wp:paragraph -->',
		$prefixed_link
	)
);

echo render_block($blocks[0]);
