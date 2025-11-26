class CrewManager {
  constructor() {
    this.currentCrew = 'douglas';
    this.crewMembers = crewData;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadCrewMember(this.currentCrew);
  }

  setupEventListeners() {
    const dots = document.querySelectorAll('.dots-slider a');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const crewKeys = ['douglas', 'mark', 'victor', 'anousheh'];
        this.switchCrewMember(crewKeys[index]);
      });
    });
  }

  switchCrewMember(crewKey) {
    if (this.crewMembers[crewKey]) {
      this.currentCrew = crewKey;
      this.loadCrewMember(crewKey);
      this.updateActiveDot(crewKey);
    }
  }

  updateActiveDot(crewKey) {
    const dots = document.querySelectorAll('.dots-slider a');
    const crewKeys = ['douglas', 'mark', 'victor', 'anousheh'];
    const activeIndex = crewKeys.indexOf(crewKey);
    
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  loadCrewMember(crewKey) {
    const crewMember = this.crewMembers[crewKey];
    if (!crewMember) return;

    this.updateImage(crewMember.image);
    this.updateRole(crewMember.role);
    this.updateName(crewMember.name);
    this.updateDescription(crewMember.description);
  }

  updateImage(imageSrc) {
    const crewImage = document.querySelector('.crew-container picture img');
    if (crewImage) {
      crewImage.src = imageSrc;
    }
  }

  updateRole(role) {
    const roleElement = document.querySelector('.profession');
    if (roleElement) {
      roleElement.textContent = role;
    }
  }

  updateName(name) {
    const nameElement = document.querySelector('.crew-member');
    if (nameElement) {
      nameElement.textContent = name;
    }
  }

  updateDescription(description) {
    const descElement = document.querySelector('.crew-member-desc');
    if (descElement) {
      descElement.textContent = description;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CrewManager();
});