# CS 260 Notes

This file represents what I have learned about web programming.

- [My startup](https://startup.quantumsanctuary.click)
- [My simon](https://simon.quantumsanctuary.click)

I love web programming

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)


## AWS

You can have billing alerts set up within AWS.

Server IP: 54.163.151.162

Shell into the server:

    ssh -i ~/keys/cs260.pem ubuntu@54.163.151.162

The class AMI comes with Ubuntu, Node.js, NVM, Caddy, and PM2 already installed.
An elastic IP keeps the address the same even if the server restarts.

An A record maps a domain name to an IP address. A wildcard record (*) covers
every subdomain at once, so startup.quantumsanctuary.click and
simon.quantumsanctuary.click both resolve without separate records.

Use `dig @nameserver domain` to query a specific nameserver directly. That tells
you whether your zone is serving correctly, separate from whether the registry
has propagated yet.

Domain: quantumsanctuary.click

Caddy uses Let's Encrypt and the ACME protocol to request and renew certificates
automatically. Let's Encrypt verifies you own the domain by asking your server to
return a signed response at a temporary URL over HTTP, then issues the cert.

In the Caddyfile, removing `:80` and putting the domain name in its place makes
Caddy serve over 443 and redirect HTTP to HTTPS. Restart with:

    sudo service caddy restart

Caddy also acts as a reverse proxy. `reverse_proxy * localhost:4000` sends
requests for startup.quantumsanctuary.click to a service running internally on
port 4000, so the browser never sees that port.

Let's Encrypt is a non profit with the goal of creating trusted web certificates for free.

## HTML

Tim Berners-Lee invented document format HyperText Markup Language HTML while working at the CERN research laboratory.

Key invention: documents could be interconnected with hyperlinks to allow immediate access to related documents

HTML originally contained only 18 elements/tags the latest has 100+ 

Simple HTML document:
<html>
  <body>
    <p>Hello world!</p>
  </body>
</html>

Web programmers have altered the web page concept into a web application where a page now represents either a single page application (SPA) or a large group of hyperlinked pages that form a multi-page application (MPA).

HTML elements are represented with enclosing tags that may enclose other elements or text.

Paragraph element associated with tag(p)

Tags are delimited with the less than (<) and greater than (>) symbols. A closing tag will also have a forward slash (/) before its name.

The html element represents top level page structure.

head element contains metadata about the page and the page title.

body element represents the content structure.

main element represents the main content structure.

HTML is mainly about structure using render visual experience wouldn't change until you style with CSS

Every HTML element can have attributes.
Examples: id attribute gives a unique ID for a element to distinguish from other elements 
The class element attribute designates the element as being classified to a named group of elements

Attributes are written inside an element tag with a name followed by an optional value 
You can use ' or " to mark attribute values 

HTML has hyperlinks
A hyperlink in HTML is represented with an anchor (a) element that has an attribute containing the address of the hyperlink reference (href).

HTML defines a header (<!DOCTYPE html>)
Always include on top of file 

You can include comments in your HTML files by starting the comment with <!-- and ending it with -->

HTML uses several reserved characters for defining its file format.

If you want to use those characters in your content then you need to escape them using the entity syntax. 
For example character > Entity is &gt;

Some of the common HTML structural elements include body, header, footer, main, section, aside, p, table, ol/ul, div, and span. 
body.

The body has three children, a header, main, and footer. Each of the body children then contains other structural content.

The header contains a paragraph with a span, and a navigation containing multiple divisions of sub-content.

The main contains multiple sections that contain either an unordered list (ul) or a table. Main also contains an aside for content that does not fit the content flow of the sections.

Block and inline:
A block element is meant to be a distinct block in the flow of the content structure.
An inline element is meant to be inline with the content flow of a block element.

Meaning inline elements do not disrupt the flow of a block elements content

For example, the block element div (division) could have an inline element b in order to bring attention to a portion of its sub-text. Likewise a p (paragraph) element could have a span to mark the paragraph's sub-text as a person's name.

<div>He said <b>don't</b> cross the beams.</div>

<p>Authors such as <span>ee cummings</span> often used unconventional structure.</p>

Replacing navigation div elements with anchor elements that have hyperlinks

<body>
  <p>Body</p>
  <header>
    <p>Header - <span>Span</span></p>
    <nav>
      Navigation
      <div>Div</div>
      <div>Div</div>
    </nav>
  </header>

Transforms into
<body> 
  <p>Body</p> 
  <header> 
    <p>Header - <span>Span</span></p> 
    <nav> 
      Navigation 
      <a href="https://byu.edu">BYU</a> 
      <a href="https://familysearch.org">FamilySearch</a> 
    </nav> 
  </header>
</body>

Change the section ul element text to be "apples", "bananas", and "oranges".
<main>
    <section>
      <p>Section</p>
      <ul>
        <li>apples</li>
        <li>bananas</li>
        <li>oranges</li>

Adding image
<aside>
      <p>Aside</p>
      <img src="https://shorturl.at/FF8tS" width="300">
    </aside>
  </main>

Hyperlink footer
  <div>Footer - <span>Span</span></div> 
    <a href="https://github.com/Shania-Ziegler/startup">GitHub Repository</a>


The footer has a content division with a single span.

key Attributes of element 
<form>

action: Defines the URL of the server-side resource (e.g., an API endpoint) that will process the submitted data.
method: Specifies the HTTP method used to send the data.
GET: Appends form data to the URL in name/value pairs. Used for non-sensitive data like search queries.
POST: Sends data inside the body of the HTTP request. Used for sensitive information (like passwords) or when sending large amounts of data.


For data to be sent to the server, every input within form must have a <name> attribute.
Without the browser will not include that specific inputs data in the submission.

> [!NOTE]
> ## Input Element
>
> Inside a `<form>`, you can include `<input>` elements that represent many different types of user input.
>
> The type of input is set using the `type` attribute:
>
> ```html
> <input type="text">
> ```
>
> | `type` | Meaning |
> |---|---|
> | `text` | Single-line textual value |
> | `password` | Obscured password |
> | `email` | Email address |
> | `tel` | Telephone number |
> | `url` | URL address |
> | `number` | Numerical value |
> | `checkbox` | Inclusive selection — multiple options can be selected |
> | `radio` | Exclusive selection — only one option can be selected |
> | `range` | Range-limited number |
> | `date` | Year, month, and day |
> | `datetime-local` | Date and time |
> | `month` | Year and month |
> | `week` | Week of the year |
> | `color` | Color picker |
> | `file` | Select a local file |
> | `submit` | Button that triggers form submission |

In order to create an input you specify the desired type attribute along with any other attribute associated with that specific input.

> [!NOTE]
> ## Common Input Attributes
>
> Most `<input>` elements share some common attributes:
>
> | Attribute | Meaning |
> |---|---|
> | `name` | The name of the input. If used in a form, this name is submitted with the input value. |
> | `disabled` | Prevents the user from interacting with the input. |
> | `value` | Sets the initial value of the input. |
> | `required` | Means the input must have a value for the form to be valid. |


Common HTML structural elements organize a webpage into meaningful sections:

<html> — the root element that contains the whole HTML document.
<head> — contains information about the page, such as the title, metadata, and links to CSS.
<body> — contains everything that is visible on the webpage.
<header> — contains introductory content, such as a page title or logo.
<nav> — contains navigation links.
<main> — contains the primary content of the page.
<section> — groups related content together.
<article> — contains self-contained content, such as a blog post or news article.
<aside> — contains related or secondary content, such as a sidebar.
<footer> — contains information at the bottom of a page or section, such as copyright or contact information.

<menu> is the semantic version of <ul> for navigation. 

Semantic meaning explained so <div> is non-semantic meaning it's a generic box that tells you nothing. 

<nav>, <header>, <footer>, <aside> are semantic, because the name describes the content's role. 
This is great for developers, screen readers and search engines.

Some additional accessibility for html
- lang="en" on the html element so screen readers know the language
- <label for="..."> tied to each input's id, so clicking the label focuses the input
- alt text on images, describing what the image shows
- headings in order (h1, h2, h3) so the page has a readable outline


<dl> with <dt>/<dd> is for term-and-definition lists.

For sensitive data like passwords, you should use method="post" to ensure credentials aren't appended to the URL in the browser history.

Remember in CSS section 
In chamber.html, while the aria-live attribute is correctly used, the initial text could be more descriptive for users relying on assistive technology.

<p>Result: <span id="result" aria-live="polite">not run yet</span></p>
Ensure that when the "Run" button is clicked, the state transition (e.g., "Running experiment...") is updated within this span so screen reader users are immediately notified that the process has started

## React

Interesting things I have learned about React

## CSS 
Cascading Style Sheets (CSS) were first proposed in 1994 by Håko Wium Lie at CERN, in order to give HTML documents visual styling independent of the content's structure.
Before the introduction of CSS, HTML was going to hard code the visual appearance of the content with HTML elements.

Below simple example of CSS that defines the white spacing, color, and shadowing of paragraph text:
p {
  margin: 0;
  padding: 20px 0;
  color: #00539f;
  text-shadow: 3px 3px 1px black;
}

CSS selectors

- How to select elements that a CSS rule applies to

Commmon selectors:

The <body> element or use wildcard element name selector (*) to select all elements 

Changing color of second level headings - we provide a descendant combinator that is defined with aa space delimited list of values where each item in the list is a descendant of the previous items

So the selector would be all h2 elements that are descendants of section elements 

| Combinator | Meaning | Example | Description |
| :--- | :--- | :--- | :--- |
| Descendant | A list of descendants | `body section` | Any section that is a descendant of a body |
| Child | A list of direct children | `section > p` | Any p that is a direct child of a section |
| General sibling | A list of siblings | `div ~ p` | Any p that has a div sibling |
| Adjacent sibling | A list of adjacent sibling | `div + p` | Any p that has an adjacent div sibling |

A CSS class selector targets html elements that share a specific class attribute written by prefixing the class name with a period


ID selectors reference the ID of an element.

To use the ID selector you prefix the ID with the hash symbol (#)

CSS attribute selectors allow you to target HTML elements based on the presence, exact value, or partial value of their attributes. You use an attribute selector to select any element with a given attribute (a[href]).

<div class="container"> <p>Paragraph 1</p> <section> <p>Paragraph 2</p> </section> </div>

to apply a style only to Paragraph 1 while leaving Paragraph 2 unaffected you use .container > p the (>) is a child combinator. Because Paragraph 1 is a direct child of .container div this selector targets it. 

Paragraph 2 on the other hand is nested inside a <section> element this makes it a descendent but not a direct child. 

Pseudo selectors target a state or a part of an element rather than the element itself.

button:hover { background: black; }      /* while the mouse is over it */
input:focus { outline: 2px solid; }      /* while it is selected */
tr:last-child { border: none; }          /* position in a list */
input::placeholder { color: grey; }      /* part of an element */
li::before { content: "1"; }             /* generated content */

Specificity decides which rule wins when two rules target the same element.
Inline style beats ID beats class beats element. If two rules have the same
specificity, the one written last wins. That is the "cascading" part of CSS.

The box model: every element is a box made of content, padding, border, and
margin, in that order from the inside out. Setting box-sizing: border-box makes
width include the padding and border, which is why most stylesheets start with:

* { box-sizing: border-box; }

Units
px is fixed. rem is relative to the root font size. % is relative to the parent.
vw and vh are percentages of the viewport width and height. Relative units are
what make a layout respond to screen size.

Custom properties (CSS variables) hold values you reuse:

:root { --ink: #16160f; }
body { color: var(--ink); }

Change the variable once and everything using it updates.

Flexbox is one dimensional, for a row or a column.
  display: flex; justify-content (main axis); align-items (cross axis);
  flex-wrap: wrap makes items drop to the next line instead of overflowing.

Grid is two dimensional, for rows and columns at once.
  display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  The fr unit is a fraction of the leftover space. auto-fit plus minmax is a
  responsive grid with no media query needed.

Media queries apply rules only when a condition is met:

@media (max-width: 820px) {
  .layout { grid-template-columns: 1fr; }
}

Animation
transition smooths a change between two states.
@keyframes defines a named sequence that animation runs.

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
.sprite { animation: float 5s ease-in-out infinite; }

transform is the less expensive way to move or scale something, because the browser does
not have to recalculate the layout.

Importing a font

@import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');
body { font-family: 'Quicksand', sans-serif; }

Always end a font stack with a generic family in case the font fails to load.

Debugging
Open dev tools, Elements tab. Overridden rules show with a strikethrough, which
tells you a more specific rule won. The Computed tab shows the final values and
the box model measurements.

## Javascript

Officially known as ECMAScript, JavaScript is a weakly typed language based upon concepts found in C, Java, and Scheme.  

JavaScript is executed using an interpreter at runtime instead of compiling it into a machine specific binary at build time.
This has the advantage of making JavaScript very portable, but also allows for many errors, such as using an undefined variable

In 1995 Netscape (the maker of the popular browser Navigator) decided to add the ability to script web pages. The initial implementation was led by Brendan Eich and given the name JavaScript. JavaScript turned the previously static web into an interactive experience where a web page could dynamically change based upon a user's interaction.

Below is an example of a simple JavaScript program that combines variables and prints out the result from CS 260 Webprogramming MLS site:

const join = (...a) => {
  return a.reduce((accumulator, currentValue) => accumulator + currentValue);
};

console.log(join(1, 2));
console.log(join('hello', ' ', 'world', '!'));


There is three primary ways to include JavaScript in HTML: using a < script > block for internal code, the src attribute to link an external file, and inline event attribute handlers for direct interaction.

Linking an external .js file is excellent for keeping projects organized and your code reusable. Internal blocks and inline handlers are often used for quick scripts or specific event triggers, like the onclick attribute.

One of the simplest ways to debug JavaScript code is to insert console.log functions that output the state of the code as it executes.

Special bonus in website perfomance:
When Adding JavaScript to HTML via external files, professional developers use minification to optimize performance.

What it does: Removes whitespace, comments, and shortens variable names to reduce file size.
Why use it: Faster load times for users.
Naming Convention: Minified files usually end in .min.js (e.g., app.min.js).
Debugging: Use Source Maps to link the minified code back to your readable "source" code in browser DevTools.
Implementation Example:


<!-- Development: Use the readable version -->
<script src="js/main.js"></script>

<!-- Production: Use the minified version for speed -->
<script src="js/main.min.js"></script>

## Node.js
In 2009 Ryan Dahl created Node.js as the first successful application for deploying JavaScript outside of a browser.

You can execute a line of JavaScript with Node.js from your console with the -e parameter.
One example: node -e "console.log(1+1)" which outputs 2

While you could write all of the JavaScript for everything you need, it is always helpful to use preexisting packages of JavaScript for implementing common tasks.

Another example
Location: ~/CS260/startup/npmtest
Entry Point: index.js (defined in package.json)
Command: node index.js
Purpose: Runs the JavaScript code through the Node engine and prints any results (like console.log) to the console.

There is also package.json.
 This file contains three main things Firstly Metadata about theproject such as its name and the default entry JavaScript file, 2 commands (scripts) that you can execute to do things like run, test, or distribute your code, and 3 packages that this project depends upon.

To update package.json you can install the package using npm install followed by the name of the package. 
Finding packages is as easy as going to the NPM website
Then using npm install <your-package name here> 

If you rexamine the contents of the package.json file you will see a reference to the newly installed package dependency. If you decide you no longer want a package dependency you can always remove it with the npm uninstall <package name here> console command.

Make sure you include node_modules in your .gitignore file as this will start getting big quickly.

When you clone your source code from GitHub to a new location, the first thing you should do is run npm install in the project directory. This will cause NPM to download all of the previously installed packages and recreate the node_modules directory.

The package-lock.json file tracks the version of the package that you installed. That way if you rebuild your node_modules directory you will have the version of the package you initially installed and not the latest available version, which might not be compatible with your code.

With NPM and a package of your choice installed, you can now use this package in a JavaScript file by referencing the package name as a parameter to the require function. This is then followed by a call to the object in the example they use joke so the objects joke getRandomDadJoke function to actually generate a joke. 



## Technology Stack 

The collection of technologies that you use to create or deliver your web application is called a technology stack.



What our stack looks like: React for the web framework, talking to Caddy as the web server hosted on AWS, running web services with Node.js, and MongoDB as the database hosted on MongoDB Atlas.



