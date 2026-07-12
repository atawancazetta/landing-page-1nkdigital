/**
 * Lógica da animação de digitação (Typewriter)
 */
const textElement = document.getElementById('typing-text');
const phrases = ["Desenvolvedor Web", "Estudante de Programação","Foco em Full Stack"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentPhrase = phrases[phraseIndex];

    // Verifica se está no modo de apagar ou escrever
    if (isDeleting) {
        textElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    // Ajusta a velocidade (apagar é mais rápido que escrever)
    let typeSpeed = isDeleting ? 50 : 100;

    // Lógica para pausar no fim da frase ou mudar de palavra
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Tempo que a frase fica visível
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length; // Cicla entre as frases
        typeSpeed = 500; // Pausa antes de começar a digitar a nova
    }

    setTimeout(type, typeSpeed);
}

// Inicia a função assim que o conteúdo do DOM estiver carregado
document.addEventListener('DOMContentLoaded', type);