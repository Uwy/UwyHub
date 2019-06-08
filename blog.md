---
layout: default
title: Blog
nav_id: blog
---
# Latest Posts

{% for post in site.posts %}
  * ## [ {{post.title}} ]( {{ post.url }} )
    {{ post.excerpt }}
{% endfor %}
