document.addEventListener('DOMContentLoaded', function() {
            // Elementos del buscador
            const searchInput = document.getElementById('search-input');
            const clearSearchBtn = document.getElementById('clear-search');
            const searchInfo = document.getElementById('search-info');
            const searchResultsCount = document.getElementById('search-results-count');
            const searchTerm = document.getElementById('search-term');
            
            // Todas las tarjetas de perfume
            const perfumeCards = document.querySelectorAll('.perfume-card');
            
            // Navegación entre secciones
            const navLinks = document.querySelectorAll('.nav-link');
            const sections = document.querySelectorAll('.category-section');
            
            let currentSearchTerm = '';
            
            // Función para buscar perfumes
            function searchPerfumes(searchTerm) {
                currentSearchTerm = searchTerm.toLowerCase().trim();
                let totalResults = 0;
                
                // Mostrar/ocultar botón de limpiar búsqueda
                if (currentSearchTerm !== '') {
                    clearSearchBtn.style.display = 'block';
                    searchInfo.style.display = 'block';
                    searchTerm.textContent = currentSearchTerm;
                } else {
                    clearSearchBtn.style.display = 'none';
                    searchInfo.style.display = 'none';
                }
                
                // Filtrar perfumes
                perfumeCards.forEach(card => {
                    const searchData = card.getAttribute('data-search').toLowerCase();
                    const isMatch = currentSearchTerm === '' || searchData.includes(currentSearchTerm);
                    
                    if (isMatch) {
                        card.style.display = 'block';
                        card.classList.add('search-match');
                        totalResults++;
                        
                        // Asegurar que las animaciones funcionen
                        card.style.animation = 'fadeInUp 0.8s ease forwards';
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('search-match');
                    }
                });
                
                // Actualizar contador de resultados
                searchResultsCount.textContent = totalResults;
                
                // Resaltar secciones con resultados
                sections.forEach(section => {
                    const grid = section.querySelector('.perfumes-grid');
                    const visibleCards = Array.from(grid.querySelectorAll('.perfume-card'))
                        .filter(card => card.style.display !== 'none');
                    
                    if (currentSearchTerm !== '') {
                        if (visibleCards.length > 0) {
                            section.style.display = 'block';
                            section.style.opacity = '1';
                        } else {
                            section.style.display = 'none';
                        }
                    } else {
                        section.style.display = 'block';
                        section.style.opacity = '1';
                    }
                });
                
                // Si hay búsqueda activa, ir a la primera sección con resultados
                if (currentSearchTerm !== '' && totalResults > 0) {
                    const firstVisibleSection = Array.from(sections).find(section => 
                        section.style.display !== 'none'
                    );
                    
                    if (firstVisibleSection) {
                        window.scrollTo({
                            top: firstVisibleSection.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                }
            }
            
            // Evento para el buscador
            searchInput.addEventListener('input', function() {
                searchPerfumes(this.value);
            });
            
            // Evento para limpiar la búsqueda
            clearSearchBtn.addEventListener('click', function() {
                searchInput.value = '';
                searchPerfumes('');
                searchInput.focus();
            });
            
            // Función para actualizar navegación activa
            function updateActiveNav() {
                let currentSectionId = '';
                
                // Determinar qué sección está actualmente en vista
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 200 && rect.bottom >= 200 && section.style.display !== 'none') {
                        currentSectionId = section.id;
                    }
                });
                
                // Actualizar enlaces de navegación
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
            
            // Escuchar scroll para actualizar navegación
            window.addEventListener('scroll', updateActiveNav);
            
            // Configurar navegación suave
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        // Actualizar enlaces activos
                        navLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Desplazamiento suave
                        window.scrollTo({
                            top: targetSection.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Animación de aparición de tarjetas al hacer scroll
            function checkCardVisibility() {
                perfumeCards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const isVisible = (rect.top <= window.innerHeight * 0.9 && rect.bottom >= 0);
                    
                    if (isVisible && card.style.opacity === '0' && card.style.display !== 'none') {
                        // Activar animación
                        card.style.animationPlayState = 'running';
                    }
                });
            }
            
            // Verificar visibilidad inicial y al hacer scroll
            checkCardVisibility();
            window.addEventListener('scroll', checkCardVisibility);
            
            // Funcionalidad de añadir al carrito
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const perfumeCard = this.closest('.perfume-card');
                    const perfumeName = perfumeCard.querySelector('.perfume-name').textContent;
                    const perfumePrice = perfumeCard.querySelector('.perfume-price').textContent;
                    
                    // Animación de confirmación
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Añadido';
                    this.style.background = 'rgba(40, 167, 69, 0.2)';
                    this.style.borderColor = '#28a745';
                    
                    // Mostrar notificación
                    showNotification(`${perfumeName} añadido al carrito - ${perfumePrice}`);
                    
                    // Restaurar botón después de 2 segundos
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.background = '';
                        this.style.borderColor = '';
                    }, 2000);
                });
            });
            
            // Función para mostrar notificación
            function showNotification(message) {
                // Crear elemento de notificación
                const notification = document.createElement('div');
                notification.className = 'notification success';
                notification.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 10px;"></i>${message}`;
                
                document.body.appendChild(notification);
                
                // Mostrar notificación
                setTimeout(() => {
                    notification.style.transform = 'translateX(0)';
                }, 100);
                
                // Ocultar y eliminar notificación después de 4 segundos
                setTimeout(() => {
                    notification.style.transform = 'translateX(150%)';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 500);
                }, 4000);
            }
            
            // Inicializar navegación activa
            updateActiveNav();
        });
         document.addEventListener('DOMContentLoaded', function() {
            // Animación para los enlaces del footer
            const footerLinks = document.querySelectorAll('.footer-links a');
            
            footerLinks.forEach(link => {
                link.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateX(5px)';
                });
                
                link.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateX(0)';
                });
            });
            
            // Animación para los iconos sociales
            const socialLinks = document.querySelectorAll('.social-link');
            
            socialLinks.forEach(link => {
                link.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-3px)';
                });
                
                link.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        });