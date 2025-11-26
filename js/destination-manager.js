class DestinationManager {
  constructor() {
    this.currentDestination = 'moon';
    this.destinations = destinationsData;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadDestination(this.currentDestination);
  }

  setupEventListeners() {
    const buttons = document.querySelectorAll('.desti-btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const destinationName = e.target.textContent.toLowerCase();
        this.switchDestination(destinationName);
      });
    });
  }

  switchDestination(destinationName) {
    if (this.destinations[destinationName]) {
      this.currentDestination = destinationName;
      this.loadDestination(destinationName);
      this.updateActiveButton(destinationName);
    }
  }

  updateActiveButton(destinationName) {
    const buttons = document.querySelectorAll('.desti-btn');
    buttons.forEach(button => {
      button.classList.remove('active');
      if (button.textContent.toLowerCase() === destinationName) {
        button.classList.add('active');
      }
    });
  }

  loadDestination(destinationName) {
    const destination = this.destinations[destinationName];
    if (!destination) return;

    this.updateImage(destination.image);
    this.updateTitle(destination.name);
    this.updateDescription(destination.description);
    this.updateDistance(destination.distance);
    this.updateTravelTime(destination.travelTime);
  }

  updateImage(imageSrc) {
    const planetImage = document.querySelector('.planet-pic-div img');
    if (planetImage) {
      planetImage.src = imageSrc;
    }
  }

  updateTitle(title) {
    const titleElement = document.querySelector('.right-div h2');
    if (titleElement) {
      titleElement.textContent = title;
    }
  }

  updateDescription(description) {
    const descElement = document.querySelector('.planet-description');
    if (descElement) {
      descElement.textContent = description;
    }
  }

  updateDistance(distance) {
    const distanceElement = document.querySelector('.avg-distance .subheading-1');
    if (distanceElement) {
      distanceElement.textContent = distance;
    }
  }

  updateTravelTime(travelTime) {
    const travelElement = document.querySelector('.travel-time .subheading-1.travel');
    if (travelElement) {
      travelElement.textContent = travelTime;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DestinationManager();
});