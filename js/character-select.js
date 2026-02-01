function changeCharacter(name) {
    let newSource = '';
    switch(name) {
        case 'Brian':
            newSource = 'img/characters/Brian.webp';
            break;
        case 'Christen':
            newSource = 'img/characters/Christen.webp';
            break;
        case 'Jack':
            newSource = 'img/characters/Jack.webp';
            break;
        case 'Jarvis':
            newSource = 'img/characters/Jarvis.webp';
            break;
        case 'Julian':
            newSource = 'img/characters/Julian.webp';
            break;
        case 'Kenny':
            newSource = 'img/characters/Kenny.webp';
            break;
        default:
            newSource = 'img/characters/Noone.webp';
    }
    document.getElementById('character-select').src = newSource;
}