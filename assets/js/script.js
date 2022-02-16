// Logic for infinite loading

// Get references to the dom elements
var scroller = document.querySelector('#scroller');
var template = document.querySelector('#post_template');
var sentinel = document.querySelector('#sentinel');

// Set a counter to count the items loaded
var counter = 0;

// Function to request new items and render to the dom
function loadItems() {

  // Use fetch to request data and pass the counter value in the QS
  fetch(`/load?c=${counter}`).then((response) => {

    // Convert the response data to JSON
    response.json().then((data) => {

      // If empty JSON, exit the function
      if (!data.length) {

        // Replace the spinner with "No more posts"
        sentinel.innerHTML = 'No more posts';
        return;
      }

      // Iterate over the items in the response
      for (var i = 0; i < data.length; i++) {

        // Clone the HTML template
        let template_clone = template.content.cloneNode(true);

        const date = new Date(data[i]['date']);
        var date_options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        // Query & update the template content
        let title_data = [data[i]['name'], data[i]['position'], data[i]['team']]
        template_clone.querySelector('#title').innerHTML = title_data.join(' | ')
        template_clone.querySelector('#date').innerHTML = date.toLocaleDateString('en-US', date_options);
        template_clone.querySelector('#news').innerHTML = data[i]['news'];
        template_clone.querySelector('#spin').innerHTML = data[i]['spin'];

        // Append template to dom
        scroller.appendChild(template_clone);

        // Increment the counter
        counter += 1;
      }
    })
  })
}

// Create a new IntersectionObserver instance
var intersectionObserver = new IntersectionObserver(entries => {
  // If intersectionRatio is 0, the sentinel is out of view
  // and we don't need to do anything. Exit the function
  if (entries[0].intersectionRatio <= 0) {
    return;
  }

  // Call the loadItems function
  loadItems();

});

// Instruct the IntersectionObserver to watch the sentinel
intersectionObserver.observe(sentinel);


// Logic for showing/hiding filter nav bar

document.addEventListener('DOMContentLoaded', function() {
  el_autohide = document.querySelector('.autohide');
  // add padding-top to body (if necessary)
  navbar_height = document.querySelector('.navbar').offsetHeight;
  document.body.style.paddingTop = navbar_height + 'px';

  if(el_autohide){
    var last_scroll_top = 0;
    window.addEventListener('scroll', function() {
         let scroll_top = window.scrollY;
         if (scroll_top < last_scroll_top) {
              el_autohide.classList.remove('scrolled-down');
              el_autohide.classList.add('scrolled-up');
          }
          else {
              el_autohide.classList.remove('scrolled-up');
              el_autohide.classList.add('scrolled-down');
          }
          last_scroll_top = scroll_top;
    });
  }
});
