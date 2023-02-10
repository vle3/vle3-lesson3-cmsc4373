import { modalInfobox } from "./elements.js";

export function info(title, body, closeModal){
    if(closeModal) closeModal.hide();
    modalInfobox.title.innerHTML = title;
    modalInfobox.body.innerHTML = body;
    modalInfobox.modal.show();
}

export function disabledButton(button){
    button.disabled = true;
    const originalLabel = button.innerHTML;
    button.innerHTML = 'Wait...';
    return originalLabel;
}

export function enabledButton(button, label){
    if(label) button.innerHTML = label;
    button.disabled = false;
}