## Introduction

This is an investigation into nationalist political parties in Europe. It strives
to give an overview of the ultra right-wing political landscape in Europe as a whole and
every country in particular. A second goal is to give insight into the relation
of these parties with each other, but also how they tie in with known fascist movements,
now and in the past. For now, it consist
of an analysis of data scraped from [Wikipedia](https://en.wikipedia.org/) - more
specifically from these two pages:

- [List of active nationalist movements in Europe](https://en.wikipedia.org/wiki/List_of_active_nationalist_parties_in_Europe)
- [List of fascist movements per country](https://en.wikipedia.org/wiki/List_of_fascist_movements_by_country)

Wikipedia is used for this project because it provides these -as good as- exhaustive list
that can be leveraged to create great overviews of a topic. It also provides a lot
of context that can be mined for meaning. In this case, a *network* was formed by
using the parties and movements as *nodes* and creating a *link* between the two if
the page of one entity linked back to another entity. So, if for example the Wikipedia
page of **Front National** mentions **Lega Nord**, a (*directed*) *link* is created between the two.
This gives a sense of how these entities are related semantically, although it is
obviously far from perfect.

This website contains two ways to explore this data and the network created.
First, there is the <a href="{{ site.baseurl }}/map">map</a> view where you get an overview of what the
political landscape is in every country and look at the network at micro scale.
Then, there is the <a href="{{ site.baseurl }}/network">network</a> overview that displays the whole network,
which allows for a macro view of the data and how certain communities arise
within the data.

Keep in mind that since the data comes from the English version of Wikipedia,
some names of parties have been translated (**Vlaams Belang** is **Flemish Interest**).


<!-- You can use the [editor on GitHub](https://github.com/wissebarkhof/european_nationalism/edit/master/README.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/wissebarkhof/european_nationalism/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out. -->
