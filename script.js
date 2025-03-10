document.addEventListener('DOMContentLoaded', function () {
    const stats = document.querySelectorAll('.stat h2');

    function countUp(element, target, duration) {
        let start = 0;
        let increment = target / (duration / 50); // A cada 50ms
        let interval = setInterval(function () {
            start += increment;
            element.textContent = `+${Math.floor(start)}`;
            if (start >= target) {
                clearInterval(interval);
                element.textContent = `+${target}`; // Garante que o número final seja exato
            }
        }, 50);
    }
    function checkVisibility() {
        const rect = document.querySelector('.community-stats').getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            stats.forEach(function (stat) {
                const target = parseInt(stat.textContent.replace('+', '').replace('.', ''));
                countUp(stat, target, 2000); // A contagem dura 2000ms (2 segundos)
            });
            window.removeEventListener('scroll', checkVisibility); // Remover o ouvinte após a animação
        }
    }
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Verificar se já está visível ao carregar a página
});

// Obtém todas as seções e os links da navbar
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar .itens a');

// Função para adicionar a classe 'active' ao link correspondente à seção visível
function setActiveLink() {
    let index = sections.length;

    while (--index && window.scrollY + 50 < sections[index].offsetTop) {} // Ajuste de 50px para considerar a navbar fixa

    navLinks.forEach(link => link.classList.remove('active')); // Remove a classe 'active' de todos os links
    navLinks[index].classList.add('active'); // Adiciona a classe 'active' ao link correspondente
}

// Chama a função sempre que o usuário rolar a página
window.addEventListener('scroll', setActiveLink);

// Chama a função quando a página for carregada (caso a página já esteja com algum scroll)
document.addEventListener('DOMContentLoaded', setActiveLink);

// Toggle do menu para dispositivos móveis
const menuToggle = document.querySelector('.menu-toggle');
const menuItems = document.querySelector('.itens');

menuToggle.addEventListener('click', () => {
    menuItems.classList.toggle('active');
});
