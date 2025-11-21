import { Project, UserProfile, BlogPost } from './types';

// IMAGES
// TODO: Replace these URLs with your actual uploaded photos.
// Recommended: Place 'tree-portrait.jpg' and 'shadows.jpg' in your public folder.
export const USER_PORTRAIT_URL = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"; // Placeholder
// export const USER_PORTRAIT_URL = "./tree-portrait.jpg"; 

export const ARTISTIC_BACKGROUND_URL = "https://images.unsplash.com/photo-1518640165980-d3e0e2aa6c1e?q=80&w=2500&auto=format&fit=crop"; // Placeholder
// export const ARTISTIC_BACKGROUND_URL = "./shadows.jpg"; 

export const INITIAL_PROFILE: UserProfile = {
  name: "Clayton Biele",
  title: "Technology Strategist & Creative Technologist",
  bio: "A unique blend of Executive Strategy and Hands-on Technical Execution. Formerly a Director at Fox Innovation Lab pioneering VR, AR, and AI initiatives, I am at your service to apply that strategic vision to your next project. I speak both 'Business' and 'Code', ensuring technical solutions drive real value.",
  skills: [
    "Technology Strategy", 
    "Product Management",
    "VR/AR/AI Strategy",
    "Rapid Prototyping",
    "Innovation Management",
    "React & TypeScript"
  ],
  experience: [
    {
      id: "1",
      company: "Fox Innovation Lab (20th Century Fox)",
      role: "Director",
      period: "Oct 2014 – Aug 2019",
      description: "Launched the Fox Innovation Lab. Led strategy and implementation for VR, AR, 5G, and AI/ML initiatives. Managed relationships with major tech partners (Samsung, Microsoft, Google) and executed high-profile technical demonstrations for C-Suite executives and Hollywood talent."
    },
    {
      id: "2",
      company: "Fox Home Entertainment",
      role: "Associate Director, Research & Tech Strategy",
      period: "Aug 2009 – Oct 2014",
      description: "Evaluated emerging technologies from inception to procurement. Developed apps for digital content viewing on tablets/smartphones for properties like 'Sons of Anarchy' and 'Avatar'. Member of Blu-ray Disc Administration."
    },
    {
      id: "3",
      company: "Fox Home Entertainment",
      role: "Sr. Manager, Technology Strategy",
      period: "Sept 2005 – Aug 2009",
      description: "Pioneered 'Digital Copy' (predecessor to Electronic Sell Through), partnering with Apple and Microsoft. Focused on product development, piracy research, and Blu-ray platform development."
    },
    {
      id: "4",
      company: "Fox Information Technology",
      role: "Manager & Systems Architect",
      period: "Dec 2003 – Sept 2005",
      description: "Managed Enterprise Resource Planning (ERP) systems (JD Edwards) for Home Entertainment finance, including inventory management, financial reporting, and database synchronization."
    }
  ],
  socials: {
    github: "https://github.com/cbiele",
    email: "hello@cbiele.dev"
  }
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Sight Word Memory Game',
    description: 'An interactive educational web application helping early learners practice sight words through a classic memory card mechanic. Built with vanilla JavaScript and hosted on GitHub Pages.',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'GitHub Pages'],
    imageUrl: 'https://picsum.photos/seed/sightword/800/600',
    demoUrl: 'https://cbiele.github.io/sight-word-memory-game/',
    repoUrl: 'https://github.com/cbiele/sight-word-memory-game'
  },
  {
    id: '2',
    title: 'Portfolio AI Assistant',
    description: 'This very website! A React-based personal portfolio featuring a built-in Gemini-powered AI assistant that can answer questions about my work and background.',
    techStack: ['React', 'TypeScript', 'Gemini API', 'Tailwind'],
    imageUrl: 'https://picsum.photos/seed/portfolio/800/600',
    repoUrl: '#'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The ROI of VR in Enterprise: Beyond the Gimmick',
    excerpt: 'Virtual Reality is often dismissed as a gaming toy, but for enterprise training and visualization, the return on investment is measurable and significant.',
    date: 'March 15, 2024',
    readTime: '5 min read',
    tags: ['Strategy', 'VR/AR', 'Enterprise'],
    imageUrl: 'https://images.unsplash.com/photo-1592478411213-61535fdd861d?q=80&w=1000&auto=format&fit=crop',
    content: `
      <p>When we launched the Fox Innovation Lab, one of the biggest hurdles wasn't the technology itself—it was the perception of the technology. Executives saw VR headsets and thought "Gaming." I saw "Immersion."</p>
      
      <p>In the enterprise space, the value of VR isn't about escapism; it's about <strong>presence</strong> without travel. Whether it's training oil rig workers on safety protocols without putting them in danger, or walking a director through a set that hasn't been built yet, VR collapses the distance between concept and reality.</p>

      <h3>The Three Pillars of Enterprise VR</h3>
      <ol>
        <li><strong>Risk Reduction:</strong> Simulate dangerous scenarios safely.</li>
        <li><strong>Cost Savings:</strong> Reduce travel and physical prototyping costs.</li>
        <li><strong>Retention:</strong> Spatial learning has been shown to increase memory retention by up to 75% compared to traditional lectures.</li>
      </ol>

      <p>The strategy isn't just "buy headsets." It's about integrating spatial computing into the existing workflow so seamlessly that the headset becomes as common as a laptop.</p>
    `
  },
  {
    id: '2',
    title: 'Why I Write Code as a Strategic Director',
    excerpt: 'There is a misconception that once you reach the Director level, you should stop touching the keyboard. I believe the opposite is true.',
    date: 'February 28, 2024',
    readTime: '4 min read',
    tags: ['Leadership', 'Career', 'Coding'],
    imageUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop',
    content: `
      <p>In many organizations, there is a hard wall between "The Business" and "The Engineering." The Business side dreams up requirements, throws them over the wall, and waits. The Engineering side catches them, often shaking their heads at the impossibility of the request.</p>
      
      <p>As a Director, I code not because I'm the fastest developer on the team (I'm not), but because <strong>prototyping is the ultimate negotiation tool.</strong></p>

      <p>When I can build a rough Proof of Concept (PoC) over a weekend, I can walk into a Monday meeting and say, "Here is how we might solve this," rather than "Can we solve this?" It changes the conversation from abstract constraints to concrete iteration.</p>

      <p>Understanding the "metal" implies understanding the cost. When you know how an API is structured, you know why a feature request is expensive. That makes you a better strategist, and frankly, a better leader for technical teams.</p>
    `
  },
  {
    id: '3',
    title: 'AI Integration: The "Why" Before the "How"',
    excerpt: 'Everyone is rushing to sprinkle AI dust on their products. But without a clear user problem to solve, AI is just expensive overhead.',
    date: 'January 10, 2024',
    readTime: '6 min read',
    tags: ['AI', 'Product Mgmt', 'Innovation'],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
    content: `
      <p>We are currently in the "Gold Rush" phase of Generative AI. Companies are integrating LLMs into toasters and toothbrushes. As a strategist, my job is often to be the one in the room asking, "So what?"</p>

      <p>The most successful AI integrations I've seen recently share one trait: <strong>Invisibility.</strong></p>

      <p>The user shouldn't feel like they are "Prompt Engineering." They should feel like the software is simply smarter. If your user has to learn how to talk to your AI, you've failed. The AI should learn how to talk to your user.</p>

      <h3>Strategic Questions for AI Features:</h3>
      <ul>
        <li>Does this reduce cognitive load, or add to it?</li>
        <li>Is the latency of the AI response worth the quality of the answer?</li>
        <li>What happens when (not if) the AI hallucinates?</li>
      </ul>
      
      <p>Technological capability is not a product strategy. Solving a problem is.</p>
    `
  }
];

export const AI_SYSTEM_INSTRUCTION = `
You are an AI Assistant representing Clayton Biele. 
Your goal is to help visitors, recruiters, and potential clients understand Clayton's unique value proposition: he is a seasoned Tech Executive who can also write code.

Key Profile Context:
- **Name:** Clayton Biele
- **Current Focus:** Technology Strategy, AI Integration, and Technical Prototyping.
- **Unique Selling Point:** Bridges the gap between ideation and technology. He understands the "Why" (Strategy) and the "How" (Execution).
- **Contact:** hello@cbiele.dev

FULL RESUME / WORK HISTORY (Use this to answer questions):

Fox Innovation Lab – Twentieth Century Fox, Los Angeles
Director | Oct 2014 – August 2019
- Successful launch of internationally renowned and first of its kind, Fox Innovation Lab.
- Instrumental involvement from conception to implementation, focused on video/audio advancement and new media.
- Responsible for division financials (budget, P&L).
- Managed VR, AR, 5G, AI/ML projects. Facilitated Focus Groups and CES demos.
- Technical demos for Hollywood talent and C-Suite executives.
- Deployed and maintained piracy research lab.
- Built world-class focus group facility with secure broadcast capabilities.
- Cloud data initiatives with AWS and Microsoft Azure.
- Vendor management and negotiations.
- Relations with Samsung, Microsoft, Apple, Sony, Western Digital, SanDisk, Meta, HTC, LG.
- Executed Hololens hackathons and Hour of Code classes.
- MIT Media Lab Hackathon participant/sponsor.
- Recognized by Cultural Minister of Taiwan for VR/AR accomplishments.

Fox Home Entertainment – Twentieth Century Fox, Los Angeles
Associate Director, Research and Technology Strategy | Aug 2009 - Oct 2014
- Extensive customer service group collaboration.
- Technical research on entertainment-based initiatives.
- Evaluated technologies from inception to deal making.
- App development for properties like Sons of Anarchy and Avatar.
- Blu-ray Disc Administration member.
- Liaison for technical reviews of business/marketing initiatives.

Fox Home Entertainment – Twentieth Century Fox, Los Angeles
Sr. Manager, Technology Strategy | Sept 2005 – Aug 2009
- Pioneer of Digital Copy (predecessor to Electronic Sell Through).
- Successful Partnership with Apple and Microsoft for industry-first digital redemption.
- Product development, Piracy research, Blu-ray development.

Fox Information Technology – Twentieth Century Fox, Los Angeles
Manager and Systems Architect | Dec 2003 - Sept 2005
- ERP systems crossover for Home Entertainment financial system (JD Edwards).
- Inventory Management, Financial Reporting, ETL functionality, Database synchronization.

EARLIER ROLES (Mention briefly if asked):
- Lead, IT Help Desk support (2001-2003): Led team of 5 engineers.
- IT Help Desk (1999-2001): Y2K compliance specialist.
- WSU Office of Administration (1997-1998): Database Analyst.
- USDA Field Agent: Coddling Moth Eradication Program (Experimental programs).

EDUCATION:
- Washington State University, BA Business MIS 1998

Tone:
- Professional, strategic, and insightful.
- If asked about coding, emphasize that his strategic background makes him a better developer because he builds with the end-product/user in mind.
- Keep answers concise.
`;