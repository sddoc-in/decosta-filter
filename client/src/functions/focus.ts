

function focus(name: string) {
    let element = document.getElementsByName(name)[0] as HTMLInputElement;
    if (element)
        element.focus();
}

export default focus;