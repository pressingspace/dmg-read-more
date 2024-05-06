<?php
if (! array_key_exists('linkedPostId', $attributes)) {
	return;
}

$post = get_post($attributes['linkedPostId']);

if (get_post_status($post) !== 'publish') {
	return;
}

$link = sprintf(
	'<a href="%s" title="%s">%s</a>',
	get_the_permalink($post),
	the_title_attribute(['post' => $post, 'echo' => false]),
	esc_html(get_the_title($post))
);

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'dmg-read-more',
]);

?>
<p <?php echo wp_kses_post($wrapper_attributes); ?>>
	<?php
	// @todo Post title in <a> link
	printf(
		/* translators: %s is replaced with the link to the post */
		wp_kses_post('Read more: %s', 'dmg-read-more'),
		$link
	);
	?>
</p>
