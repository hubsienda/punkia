<script>
  class MarkovBullshit {
    constructor() {
      this.corpus = [];
      this.chain = {};
      this.loadCorpus();
    }

    async loadCorpus() {
      try {
        const res = await fetch('https://raw.githubusercontent.com/hubsienda/punkia/main/corpus.txt?nocache=' + Date.now());
        const text = await res.text();
        this.corpus = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 10); // skip short/empty

        this.buildChain();
        this.generate(); // auto-generate one on load
      } catch (e) {
        console.warn("Failed to load corpus:", e);
        document.getElementById('markov-output').textContent = `"We are experiencing a strategic reframe of our expectations."`;
      }
    }

    buildChain() {
      this.chain = {};
      const allWords = [];

      this.corpus.forEach(sentence => {
        const words = ['__START__', ...sentence.split(/\s+/), '__END__'];
        allWords.push(...words);
      });

      for (let i = 0; i < allWords.length - 2; i++) {
        const key = allWords[i] + ' ' + allWords[i + 1];
        const next = allWords[i + 2];

        if (!this.chain[key]) this.chain[key] = [];
        this.chain[key].push(next);
      }
    }

    generate() {
      let words = [];
      let key = '__START__ ' + this.randomWord();
      let [w1, w2] = key.split(' ');

      while (w2 !== '__END__' && words.length < 25) {
        const nextWords = this.chain[w1 + ' ' + w2] || ['innovation', 'synergy', 'growth', '__END__'];
        const next = this.randomFrom(nextWords);

        if (next === '__END__') break;

        words.push(next);
        w1 = w2;
        w2 = next;
      }

      const result = words.join(' ').replace(/[^a-zA-Z0-9\s.,;:()]/g, '') + '.';
      const output = document.getElementById('markov-output');
      if (output) output.textContent = `"${this.capitalize(result)}"`;
    }

    randomFrom(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    randomWord() {
      const candidates = ['We', 'Our', 'The', 'Sustainability', 'Innovation', 'Growth', 'Impact', 'Value', 'Culture', 'Team', 'Vision', 'Mission', 'Purpose', 'Future', 'Paradigm'];
      return this.randomFrom(candidates);
    }

    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }

  // Initialise on load
  let markov;
  document.addEventListener('DOMContentLoaded', () => {
    markov = new MarkovBullshit();
  });

  window.punkiaMarkov = function() {
    if (markov) markov.generate();
  };
</script>

<style>
  #markov-container {
    max-width: 680px;
    margin: 2.5rem auto;
    padding: 2rem;
    background: #f9f9ff;
    border: 2px solid #6666CC;
    border-radius: 12px;
    font-family: 'Segoe UI', sans-serif;
    text-align: center;
    box-shadow: 0 4px 16px rgba(102, 102, 204, 0.1);
  }
  #markov-container h3 {
    margin: 0 0 1rem 0;
    color: #6666CC;
    font-size: 1.4rem;
    font-weight: 600;
  }
  #markov-output {
    margin: 1.2rem 0;
    min-height: 60px;
    color: #222;
    font-style: italic;
    line-height: 1.5;
  }
  .markov-btn {
    background: #FF00CC;
    color: white;
    border: none;
    padding: 0.75rem 1.6rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(255, 0, 204, 0.3);
  }
  .markov-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(255, 0, 204, 0.4);
  }
  .fine-print {
    margin-top: 1.2rem;
    font-size: 0.85rem;
    color: #666666;
    font-style: italic;
  }
</style>

<div id="markov-container">
  <h3>Markov Bullshit Generator</h3>
  <p style="color: #666; font-size: 0.95rem;">Powered by probability, not purpose.</p>
  <p id="markov-output"></p>
  <button class="markov-btn" onclick="punkiaMarkov()">Generate Nonsense</button>
  <p class="fine-print">
    This sentence was statistically inevitable. No humans were harmed in its creation.
  </p>
</div>
