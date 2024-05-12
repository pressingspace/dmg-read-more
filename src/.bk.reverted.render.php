<?php
if (! array_key_exists('linkedPostId', $attributes)) {
	return;
}

$post = get_post($attributes['linkedPostId']);

if (get_post_status($post) !== 'publish') {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'dmg-read-more',
]);

$link = sprintf(
	'<a class="dmg-read-more" href="%s" title="%s">%s</a>',
	get_the_permalink($post),
	the_title_attribute(['post' => $post, 'echo' => false]),
	esc_html(get_the_title($post))
);

echo wp_kses_post(sprintf(
	'<p %s>%s: %s</p>',
	$wrapper_attributes,
	__('Read more', 'dmg-read-more'),
	$link
));
