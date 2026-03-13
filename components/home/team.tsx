"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Annie Zeka",
    position: "Operations",
    image:
      "https://www.blueskydisposal.com/wp-content/themes/bluesky/images/Profile_Annie.png",
    description:
      "Ensures smooth operations and customer satisfaction across all services.",
  },
  {
    name: "Elvana Dedvukaj",
    position: "Operations",
    image:
      "https://www.blueskydisposal.com/wp-content/themes/bluesky/images/Profile_Elvana.png",
    description:
      "Leads strategic growth, client relations, and expansion efforts.",
  },
  {
    name: "Christina Antypas",
    position: "Operations",
    image:
      "https://www.blueskydisposal.com/wp-content/themes/bluesky/images/Profile_Christina.png",
    description:
      "Delivers exceptional customer experiences and service quality.",
  },
  {
    name: "Anton Dedvukaj",
    position: "Operations",
    image:
      "https://www.blueskydisposal.com/wp-content/themes/bluesky/images/Profile_Anton.png",
    description:
      "Coordinates efficient dispatch, routing, and field operations.",
  },
];

export default function TeamSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-black mb-6">
            Meet Our Team
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Behind every successful service is a group of driven, passionate professionals who ensure customer satisfaction and operational excellence.
          </p>
        </div>

        <div className="relative px-8 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {teamMembers.map((member, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/4">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-[#f0f8ff] rounded-xl p-6 text-center border border-blue-50 h-full flex flex-col items-center"
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium text-sm mb-4">{member.position}</p>

                    <p className="text-gray-500 text-xs leading-relaxed">
                      {member.description}
                    </p>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="-left-4 bg-white border-gray-200 hover:bg-gray-50 text-gray-600" />
            <CarouselNext className="-right-4 bg-white border-gray-200 hover:bg-gray-50 text-gray-600" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
