import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Twitter, Github } from "lucide-react";

const team = [
  {
    name: "Christopher Hardy Gunawan",
    role: "Co-Founder & CEO",
    bio: "Former franchise industry executive with 15+ years experience. Led digital transformation at major franchise brands.",
    image: "/team-sarah.jpg",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "David Christian",
    role: "Co-Founder & CTO",
    bio: "Blockchain architect and Internet Computer developer. Previously built DeFi protocols with $100M+ TVL.",
    image: "/team-michael.jpg",
    social: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Farrel Tobias Saputro",
    role: "Head of Product",
    bio: "Product leader with expertise in marketplace platforms. Former PM at leading fintech and e-commerce companies.",
    image: "/team-emily.jpg",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Valentino Febrian Kencono",
    role: "Head of Business Development",
    bio: "Franchise industry veteran with extensive franchisor network. Expert in franchise operations and growth strategies.",
    image: "/team-david.jpg",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Darren Kent",
    role: "Head of Business Development",
    bio: "Franchise industry veteran with extensive franchisor network. Expert in franchise operations and growth strategies.",
    image: "/team-david.jpg",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
];

export function TeamSection() {
  return (
    <section className="py-30 bg-gradient-to-b from-secondary to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-primary mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            We're a diverse team of franchise industry experts, blockchain
            developers, and product innovators united by our mission to
            revolutionize franchising.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-4">
          {team.map((member, index) => (
            <Card
              key={index}
              className="border-neutral-200 hover:shadow-lg transition-shadow text-center shadow-neutral-200"
            >
              <CardContent className="p-6">
                <img
                  src={"https://picsum.photos/seed/" + index + "/200/200/"}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-sans font-bold text-lg text-primary mb-1">
                  {member.name}
                </h3>
                <p className="text-brand-600 text-md mb-3 font-jetbrains-mono">
                  {member.role}
                </p>
                <p className="text-neutral-700 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                <div className="flex justify-center gap-3">
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-background shadow-lg shadow-neutral-200">
            <CardContent className="p-8">
              <h3 className="font-sans font-bold text-2xl text-primary mb-4">
                Join Our Team
              </h3>
              <p className="text-neutral-700 leading-relaxed mb-6">
                We're always looking for talented individuals who share our
                passion for innovation and transparency. Help us build the
                future of franchising.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-blue-400 hover:text-blue-500 font-medium transition-colors underline"
              >
                View Open Positions
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
