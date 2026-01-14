        // Animación adicional para las notas de perfume
        document.addEventListener('DOMContentLoaded', function() {
            const notes = document.querySelectorAll('.perfume-note');
            
            notes.forEach(note => {
                // Posición aleatoria inicial
                note.style.left = `${Math.random() * 80 + 10}%`;
                
                // Duración aleatoria de animación
                const duration = Math.random() * 5 + 8;
                note.style.animationDuration = `${duration}s`;
            });
            
            // Efecto interactivo para el botón CTA
            const ctaButton = document.querySelector('.cta-button');
            ctaButton.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.05)';
            });
            
            ctaButton.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
            
            // Crear notas de perfume adicionales
            const heroSection = document.querySelector('.hero-section');
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createFloatingNote();
                }, i * 1500);
            }
            
            function createFloatingNote() {
                const note = document.createElement('div');
                note.classList.add('perfume-note');
                note.style.width = `${Math.random() * 25 + 10}px`;
                note.style.height = note.style.width;
                note.style.left = `${Math.random() * 90 + 5}%`;
                note.style.top = '100%';
                note.style.animation = `floatUp ${Math.random() * 5 + 8}s linear infinite`;
                note.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
                heroSection.appendChild(note);
                
                // Remover la nota después de que complete su animación
                setTimeout(() => {
                    note.remove();
                }, 9000);
            }
            
            // Crear nuevas notas periódicamente
            setInterval(createFloatingNote, 3000);
        });