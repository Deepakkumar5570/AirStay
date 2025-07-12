// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()




  // Show 3 at a time
  const reviewsPerBatch = 3;
  let currentIndex = 0;
  const reviewCards = document.querySelectorAll(".review-card");
  const loadBtn = document.getElementById("load-more");

  function showNextBatch() {
    for (let i = currentIndex; i < currentIndex + reviewsPerBatch; i++) {
      if (reviewCards[i]) {
        reviewCards[i].classList.remove("d-none");
      }
    }
    currentIndex += reviewsPerBatch;
    if (currentIndex >= reviewCards.length) {
      loadBtn.style.display = "none";
    }
  }

  loadBtn.addEventListener("click", showNextBatch);
  // Show first batch initially
  showNextBatch();
