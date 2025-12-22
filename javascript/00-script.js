// +++ Akkordeon +++

const parcours01 = {
    accordion: {
      1: {
        "button-p": "Wo steht das?",
        "panel-info": "BERLIN ist die Hauptstadt und größte Stadt Deutschlands. Hier leben fast vier Millionen Menschen.",
        "panel-image": "./assets/00 - 0101.JPG",
      },
      2: {
        "button-p": "Und vor allem: warum?",
        "panel-info": "Der preußische König Friedrich Wilhelm II. wollte ein besonders prächtiges Stadttor für die Berliner Innenstadt. Er ließ es im Stil eines griechischen Tempels bauen.",
      },
    },
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    const accordionData = parcours01.accordion;
    const accordionWrapper = document.querySelector(".accordion-wrapper");
  
    // Clear the accordion container to avoid duplication
    accordionWrapper.innerHTML = "";
  
    // Generate accordion items dynamically
    Object.values(accordionData).forEach((item) => {
      const container = document.createElement("div");
      container.classList.add("accordion-container");
  
      const button = document.createElement("button");
      button.classList.add("accordion-button");
      const buttonP = document.createElement("p");
      buttonP.textContent = item["button-p"];
      button.appendChild(buttonP);
  
      const panel = document.createElement("div");
      panel.classList.add("accordion-panel");

      if (item["panel-image"]) {
        const panelImage = document.createElement("img");
        panelImage.classList.add("accordion-image");
        panelImage.src = item["panel-image"];
        //panelImage.alt = item["button-p"] || "Bild zur Sehenswürdigkeit";
        panelImage.loading = "lazy"; // optional Performance
        panel.appendChild(panelImage); // ✅ bewusst VOR der Info
      }

      const panelInfo = document.createElement("div");
      panelInfo.classList.add("accordion-info");
      panelInfo.textContent = item["panel-info"];
      panel.appendChild(panelInfo);
  
      container.appendChild(button);
      container.appendChild(panel);
  
      // Append to the accordion container
      accordionWrapper.appendChild(container);
    });
  
    // Add functionality to the accordion buttons
    const accordionButtons = document.querySelectorAll(".accordion-button");
    accordionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const panel = button.nextElementSibling;
  
        // Toggle the 'open' class
        if (panel.classList.contains("open")) {
          panel.classList.remove("open");
        } else {
          panel.classList.add("open");
        }
      });
    });
  });
  
  
  
  // +++ Lückentext +++
  
  const parcours02 = {
    cloze: {
      text: "...",
      draggables: [],
    },
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    const textContainer = document.querySelector(".drag-and-drop-text-container");
    const draggableContainer = document.querySelector(".drag-and-drop-draggable-container");
    const solveButton = document.querySelector(".solve-quiz-button");
    const refreshButton = document.querySelector(".refresh-quiz-button");
    const feedbackContainer = document.querySelector(".feedback-container");
  
    let dropzones = [];
    let draggables = [...parcours02.cloze.draggables];
    let markedElement = null;
  
    // Parse text into spans with dropzones
    const parseText = () => {
      const parts = parcours02.cloze.text.split(/(\/[^/]+\/)/); // Split on /word/
      parts.forEach((part) => {
        if (part.startsWith("/") && part.endsWith("/")) {
          const dropzone = document.createElement("span");
          dropzone.className = "dropzone";
          dropzone.style.minWidth = "5rem";
          dropzone.style.backgroundColor = "var(--lightblue)";
          dropzones.push(dropzone);
          textContainer.appendChild(dropzone);
        } else {
          const span = document.createElement("span");
          span.textContent = part;
          textContainer.appendChild(span);
        }
      });
    };
  
    // Shuffle an array
    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
  
    // Create draggable elements
    const createDraggables = () => {
      shuffleArray(draggables).forEach((text) => {
        const draggable = document.createElement("div");
        draggable.className = "draggable";
        draggable.textContent = text;
        draggableContainer.appendChild(draggable);
  
        // Add click event to toggle "marked" class
        draggable.addEventListener("click", () => {
          if (markedElement === draggable) {
            draggable.classList.remove("marked");
            markedElement = null;
          } else {
            if (markedElement) markedElement.classList.remove("marked");
            draggable.classList.add("marked");
            markedElement = draggable;
          }
        });
      });
    };
  
    // Add events to dropzones
    const addDropzoneEvents = () => {
      dropzones.forEach((dropzone) => {
        dropzone.addEventListener("click", () => {
          if (markedElement) {
            // Retrieve and handle the existing content in the dropzone
            if (dropzone.classList.contains("filled")) {
              const existingContent = dropzone.textContent;
              const newDraggable = document.createElement("div");
              newDraggable.className = "draggable";
              newDraggable.textContent = existingContent;
              draggableContainer.appendChild(newDraggable);
  
              // Re-add click event for the new draggable
              newDraggable.addEventListener("click", () => {
                if (markedElement === newDraggable) {
                  newDraggable.classList.remove("marked");
                  markedElement = null;
                } else {
                  if (markedElement) markedElement.classList.remove("marked");
                  newDraggable.classList.add("marked");
                  markedElement = newDraggable;
                }
              });
  
              // Add the existing content back to draggables array
              draggables.push(existingContent);
            }
  
            // Replace dropzone content with the marked draggable
            dropzone.textContent = markedElement.textContent;
            dropzone.classList.add("filled");
            markedElement.parentNode.removeChild(markedElement);
            markedElement = null;
          } else if (dropzone.classList.contains("filled")) {
            // Clear the dropzone and restore the content to draggables
            const text = dropzone.textContent;
            dropzone.textContent = "";
            dropzone.classList.remove("filled");
  
            const newDraggable = document.createElement("div");
            newDraggable.className = "draggable";
            newDraggable.textContent = text;
            draggableContainer.appendChild(newDraggable);
  
            // Re-add click event for the new draggable
            newDraggable.addEventListener("click", () => {
              if (markedElement === newDraggable) {
                newDraggable.classList.remove("marked");
                markedElement = null;
              } else {
                if (markedElement) markedElement.classList.remove("marked");
                newDraggable.classList.add("marked");
                markedElement = newDraggable;
              }
            });
  
            draggables.push(text);
          }
          updateSolveButton();
        });
      });
    };
  
    // Check if all dropzones are filled
    const updateSolveButton = () => {
      const allFilled = dropzones.every((dropzone) => dropzone.classList.contains("filled"));
      if (allFilled) {
        solveButton.classList.remove("invisible");
      } else {
        solveButton.classList.add("invisible");
      }
    };
  
    // Check answers
    const checkAnswers = () => {
      let allCorrect = true;
      const correctAnswers = parcours02.cloze.text.match(/\/([^/]+)\//g).map((match) => match.slice(1, -1));
  
      dropzones.forEach((dropzone, index) => {
        if (dropzone.textContent === correctAnswers[index]) {
          dropzone.style.backgroundColor = "var(--lightgreen)";
          feedbackContainer.classList.add("correct");
        } else {
          dropzone.style.backgroundColor = "var(--lightred)";
          feedbackContainer.classList.add("incorrect");
          allCorrect = false;
        }
      });
  
      feedbackContainer.classList.remove("invisible");
      solveButton.classList.add("invisible");
      feedbackContainer.innerHTML = allCorrect
        ? "<div>Das ist richtig!</div>"
        : "<div>Das war noch nicht richtig!<br>Versuche es erneut!</div>";
  
      refreshButton.classList.remove("invisible");
    };
  
    // Reset the game
    const resetGame = () => {
      textContainer.innerHTML = "";
      draggableContainer.innerHTML = "";
      dropzones = [];
      draggables = [...parcours02.cloze.draggables];
      markedElement = null;
      feedbackContainer.classList.add("invisible");
      feedbackContainer.classList.remove("correct");
      feedbackContainer.classList.remove("incorrect");
      solveButton.classList.add("invisible");
      refreshButton.classList.add("invisible");
      parseText();
      createDraggables();
      addDropzoneEvents();
    };
  
    // Add event listeners
    solveButton.addEventListener("click", checkAnswers);
    refreshButton.addEventListener("click", resetGame);
  
    // Initialize game
    parseText();
    createDraggables();
    addDropzoneEvents();
  });
  
  
  // +++ Memory +++
  
  const parcours03 = {
    memory: {
      pair1: {
        cards: [
        { type: "text", value: "Berliner Fernsehturm" },
        { type: "image", value: "./assets/00 - 0301.JPG" },
      ],
        feedback: "Der Berliner Fernsehturm ist mit 368 Metern das höchste Bauwerk Deutschlands.",
        color: "var(--accent-1)",
      },
      pair2: {
        cards: [
        { type: "text", value: "Neptun- brunnen" },
        { type: "image", value: "./assets/00 - 0302.JPG" },
      ],
        feedback: "Der berühmte Brunnen steht vor dem Roten Rathaus - der Meeresgott Neptun war für den Kaiser damals ein Sinnbild von Macht.",
        color: "var(--accent-2)",
      },
      pair3: {
        cards: [
        { type: "text", value: "Reichstags- gebäude" },
        { type: "image", value: "./assets/00 - 0303.JPG" },
      ],
        feedback: "Hier versammelt sich der Deutsche Bundestag. Aber weil Deutschland bei Bau des Gebäudes noch ein Kaiserreich war, heißt es Reichstag.",
        color: "var(--accent-3)",
      }
    },
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    const cardsContainer = document.querySelector(".memory-cards-container");
    const feedbackPair = document.querySelector(".memory-feedback-pair");
    const continueButton = document.querySelector(".memory-feedback-continue");
    const feedbackFinal = document.querySelector(".memory-feedback-final");
    const refreshButton = document.querySelector(".refresh-memory-button");
  
    let selectedCards = [];
    let matchedPairs = 0;
    let allowClicks = true; // Controls if card clicks are allowed
  
    // Generate memory cards dynamically
    const generateCards = () => {
      const pairs = Object.entries(parcours03.memory);
      const allCards = pairs.flatMap(([pairKey, pair]) =>
        pair.cards.map((cardItem) => ({
          value: cardItem,
          color: pair.color,
          pairKey: pairKey,
        }))
      );
  
      // Shuffle cards
      const shuffledCards = allCards.sort(() => Math.random() - 0.5);
  
      shuffledCards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.className = "memory-card";
        cardElement.dataset.pairId = card.pairKey; // Use joined cards to identify pairs
  
        const front = document.createElement("div");
        front.className = "memory-card-front";
        front.classList.add("is-image");
        if (card.value.type === "image") {
          const img = document.createElement("img");
          img.className = "memory-card-image";
          img.src = card.value.value;
          img.loading = "lazy";
          front.appendChild(img);
          } else {
            front.classList.add("is-text");
            front.textContent = card.value.value;
        }
        front.style.border = `0.5rem solid ${card.color}`;
  
        const back = document.createElement("div");
        back.className = "memory-card-back";
        back.style.backgroundColor = "var(--lightblue)";
  
        cardElement.appendChild(front);
        cardElement.appendChild(back);
  
        cardElement.addEventListener("click", () => flipCard(cardElement));
        cardsContainer.appendChild(cardElement);
      });
    };
  
    // Flip card logic
    const flipCard = (card) => {
      if (!allowClicks || selectedCards.includes(card) || card.classList.contains("matched")) return;
  
      card.classList.add("flipped");
      selectedCards.push(card);
  
      if (selectedCards.length === 2) checkForMatch();
    };
  
    // Check if two selected cards are a match
    const checkForMatch = () => {
      const [card1, card2] = selectedCards;
      const pairId1 = card1.dataset.pairId;
      const pairId2 = card2.dataset.pairId;
  
      allowClicks = false; // Prevent further clicks until feedback is handled
  
      if (pairId1 === pairId2) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchedPairs++;
  
        const feedback = parcours03.memory[pairId1].feedback;
  
        feedbackPair.textContent = feedback;
        feedbackPair.style.display = "block";
        continueButton.classList.remove("invisible");
  
        continueButton.onclick = () => {
          feedbackPair.style.display = "none";
          continueButton.classList.add("invisible");
          selectedCards = [];
          allowClicks = true; // Allow clicks after feedback is handled
          checkGameCompletion();
        };
      } else {
        feedbackPair.textContent = "Das war noch nicht richtig!";
        feedbackPair.style.display = "block";
  
        setTimeout(() => {
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
          feedbackPair.style.display = "none";
          selectedCards = [];
          allowClicks = true; // Allow clicks after mismatch
        }, 2000);
      }
    };
  
    // Check if all pairs are matched
    const checkGameCompletion = () => {
      if (matchedPairs === Object.keys(parcours03.memory).length) {
        feedbackFinal.textContent = "Du hast alle Kartenpaare gefunden!";
        feedbackFinal.style.display = "block";
        refreshButton.classList.remove("invisible");
  
        refreshButton.addEventListener("click", resetGame);
      }
    };
  
    // Reset the game
    const resetGame = () => {
      cardsContainer.innerHTML = "";
      feedbackPair.style.display = "none";
      feedbackFinal.style.display = "none";
      continueButton.classList.add("invisible");
      refreshButton.classList.add("invisible");
      selectedCards = [];
      matchedPairs = 0;
      allowClicks = true;
      generateCards();
    };
  
    // Initialize the game
    generateCards();
  });
  
  
  // +++ Single-Choice-Quiz +++
  
  const parcours04 = {
    "single-choice": {
      card1: {
        question: "Wie heißt der Wagen mit den vier Pferden auf dem Tor?",
        options: ["Quadriga", "Pentagramm", "Trilobit"],
        answer: "Die Quadriga ist ein Friedenssymbol. Als Napoleon Berlin eroberte, nahm er die Quadriga mit und ließ sie in Paris aufstellen.",
      },
      card2: {
        question: "Wonach ist das Brandenburger Tor benannt?",
        options: ["Nach einer Stadt", "Nach seinem Architekten", "Nach einem Hacksteak im Brötchen"],
        answer: "Wer Berlin durch dieses Tor verlässt, fährt in Richtung der Stadt Brandenburg. Früher hieß das Tor allerdings Friedenstor.",
      },
    },
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    const singleChoiceContainer = document.querySelector(".single-choice-container");
    const parentContainer = singleChoiceContainer.parentNode;
  
    // Shuffle array utility
    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
  
    // Generate single-choice containers dynamically
    const generateSingleChoiceContainers = () => {
      const cards = Object.values(parcours04["single-choice"]);
  
      parentContainer.innerHTML = ""; // Clear existing containers
  
      cards.forEach((card, index) => {
        const container = singleChoiceContainer.cloneNode(true);
        const questionElement = container.querySelector(".single-choice-question div");
        const optionsContainer = container.querySelector("form");
        const submitButton = container.querySelector(".single-choice-submit-button");
        const feedbackElement = container.querySelector(".single-choice-feedback div");
        const answerElement = container.querySelector(".single-choice-answer div");
        const feedbackContainer = container.querySelector(".single-choice-feedback");
        const refreshButton = container.querySelector(".refresh-single-choice-button");
  
        // Set question
        questionElement.textContent = card.question;
  
        // Shuffle options and add them to the form
        const shuffledOptions = shuffleArray(card.options.map((option, i) => ({
          text: option,
          correct: i === 0, // First option is correct in the original array
        })));
  
        shuffledOptions.forEach((option) => {
          const optionContainer = document.createElement("div");
          optionContainer.className = "single-choice-option";
  
          const input = document.createElement("input");
          input.type = "radio";
          input.name = `question-${index}`;
          input.value = option.text;
          input.dataset.correct = option.correct;
  
          const label = document.createElement("label");
          label.textContent = option.text;
          label.className = "single-choice-option-label";
  
          optionContainer.appendChild(input);
          optionContainer.appendChild(label);
          optionsContainer.insertBefore(optionContainer, submitButton);
        });
  
        // Disable submit button by default
        submitButton.disabled = true;
  
        // Enable submit button when an option is selected
        optionsContainer.addEventListener("change", () => {
          submitButton.disabled = false;
        });
  
        // Handle form submission
        optionsContainer.addEventListener("submit", (e) => {
          e.preventDefault();
          optionsContainer.style.display = "none";
          const selectedOption = optionsContainer.querySelector("input[type='radio']:checked");
          if (!selectedOption) return; // Do nothing if no option is selected
  
          const isCorrect = selectedOption.dataset.correct === "true";
  
          feedbackElement.textContent = isCorrect
            ? "Das ist richtig!"
            : "Das war leider noch nicht richtig!";
          feedbackContainer.style.backgroundColor = isCorrect ? "var(--green)" : "var(--red)";
  
          answerElement.textContent = card.answer;
  
          feedbackContainer.style.display = "block";
          refreshButton.classList.remove("invisible");
  
          // Disable further interactions
          const inputs = optionsContainer.querySelectorAll("input[type='radio']");
          inputs.forEach((input) => (input.disabled = true));
  
          // Disable the submit button
          submitButton.disabled = true;
        });
  
        // Handle refresh button
        refreshButton.addEventListener("click", () => {
          feedbackContainer.style.display = "none";
          optionsContainer.style.display = "flex";
          feedbackElement.textContent = "";
          answerElement.textContent = "";
          refreshButton.classList.add("invisible");
  
          const inputs = optionsContainer.querySelectorAll("input[type='radio']");
          inputs.forEach((input) => {
            input.checked = false;
            input.disabled = false;
          });
  
          submitButton.disabled = true; // Reset submit button
        });
  
        parentContainer.appendChild(container);
      });
    };
  
    generateSingleChoiceContainers();
  });
  
  
  