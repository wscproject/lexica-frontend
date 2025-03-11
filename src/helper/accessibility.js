const disableFront = (item) => {
  const div = item.querySelector(".card-front");
  const children = div.querySelectorAll(".interactable");
  const recommendation = div.querySelector("#rec-container");
  recommendation.style.display = "none";

  // div?.querySelector("#rec-container").setAttribute("tabindex", "-1");

  children?.forEach((child) => {
    if (child.className.includes("cdx-search-input")) {
      child
        .querySelector(".cdx-text-input__input")
        .setAttribute("tabindex", "-1");
    } else if (child.className.includes("cdx-text-area")) {
      child
        .querySelector(".cdx-text-area__textarea")
        .setAttribute("tabindex", "-1");
    } else {
      child.setAttribute("tabindex", "-1");
    }
  });

  const recBox = div?.querySelectorAll(".recommendation-box");
  recBox?.forEach((child) => {
    child.setAttribute("tabindex", "-1");
  });
};

const disableDetail = (item) => {
  const section = item?.querySelector(".card-detail");

  if (section) {
    const children = section.querySelectorAll(".interactable");
    children?.forEach((child) => {
      child.setAttribute("tabindex", "");
    });
  }
};

const disableItemDetail = (item) => {
  const section = item?.querySelector(".card-item-detail");

  const children = section?.querySelector(".interactable");
  children?.setAttribute("tabindex", "");
};

const disableReview = (item) => {
  const section = item?.querySelector(".card-review");

  const children = section?.querySelectorAll(".interactable");
  children?.forEach((child) => {
    child.setAttribute("tabindex", "-1");
  });
};

export const cardDisableAccessibilityConnect = (status, item, curr) => {
  if (status === "active") {
    disableFront(item);
  } else {
    if (curr === 1) {
      disableDetail(item);
    } else if (curr === 2) {
      disableItemDetail(item);
    } else if (curr === 3) {
      disableReview(item);
    }
  }
};
