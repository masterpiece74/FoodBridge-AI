import { motion } from "framer-motion";
import {
  Brain,
  Building2,
  HeartHandshake,
  MapPin,
  PackageCheck,
  Truck,
  Users,
  Utensils,
} from "lucide-react";

const roles = [
  {
    number: "01",
    icon: Building2,
    title: "Food Donors",
    description:
      "Restaurants, hotels, supermarkets, event organizers, and individuals can turn surplus food into meaningful support.",
    tags: ["Restaurants", "Supermarkets", "Events"],
  },
  {
    number: "02",
    icon: HeartHandshake,
    title: "Recipients",
    description:
      "Verified NGOs and community organizations receive food matched to their needs, location, and capacity.",
    tags: ["NGOs", "Shelters", "Communities"],
  },
  {
    number: "03",
    icon: Truck,
    title: "Volunteers",
    description:
      "People within the network can help move rescued food safely from donors to recipients.",
    tags: ["Pickup", "Delivery", "Support"],
  },
];

const roleVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function EcosystemSection() {
  return (
    <section
      id="ecosystem"
      className="relative overflow-hidden bg-[#F4F8F5] px-5 py-20 sm:px-6 md:px-12 md:py-24 lg:px-20"
    >
      {/* Background decoration */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#A7D7B8]/20 blur-3xl" />

      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -bottom-20 -right-32 h-72 w-72 rounded-full bg-[#F59E0B]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#1F7A4D]/10 bg-white px-4 py-2 text-xs font-semibold text-[#1F7A4D] shadow-sm sm:text-sm">
            <Users size={15} />

            One network. Shared impact.
          </div>

          <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-[#0B2F1A] sm:text-4xl md:text-5xl lg:text-6xl">
            Everyone has a role in
            <br className="hidden sm:block" />{" "}
            <span className="text-[#1F7A4D]">
              fighting food waste.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#0B2F1A]/50 sm:mt-6 sm:text-lg sm:leading-8">
            FoodBridge AI brings donors, recipients, and volunteers
            together in one intelligent network designed to move
            surplus food where it can create the most value.
          </p>
        </motion.div>

        {/* Ecosystem flow */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.75,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mt-12 max-w-5xl sm:mt-16"
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#0B2F1A]/8 bg-white p-4 shadow-[0_12px_45px_rgba(11,47,26,0.05)] sm:rounded-[2rem] sm:p-6 md:p-10">
            {/* Desktop connecting line */}

            <div className="absolute left-[17%] right-[17%] top-1/2 hidden h-px bg-[#1F7A4D]/10 md:block" />

            <div className="relative grid gap-4 md:grid-cols-3 md:gap-6">
              <FlowNode
                icon={Utensils}
                label="SURPLUS FOOD"
                title="Donor"
                description="Food enters the network"
                delay={0}
              />

              <FlowNode
                icon={Brain}
                label="AI MATCH"
                title="FoodBridge AI"
                description="Finds the best destination"
                delay={0.15}
                highlighted
              />

              <FlowNode
                icon={PackageCheck}
                label="COMMUNITY NEED"
                title="Recipient"
                description="Food reaches people"
                delay={0.3}
              />
            </div>
          </div>
        </motion.div>

        {/* Role cards */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            staggerChildren: 0.12,
          }}
          className="mt-5 grid gap-5 md:mt-6 lg:grid-cols-3"
        >
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <motion.div
                key={role.title}
                variants={roleVariants}
                whileHover={{
                  y: -7,
                  transition: {
                    duration: 0.25,
                    ease: "easeOut",
                  },
                }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-[#0B2F1A]/8 bg-white p-6 shadow-[0_10px_35px_rgba(11,47,26,0.05)] transition-all duration-300 hover:border-[#1F7A4D]/20 hover:shadow-[0_18px_45px_rgba(11,47,26,0.09)] sm:p-7"
              >
                {/* Header */}

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-[0.2em] text-[#0B2F1A]/20">
                    {role.number}
                  </span>

                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      rotate: 4,
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1F7A4D]/10 text-[#1F7A4D] transition-colors duration-300 group-hover:bg-[#1F7A4D] group-hover:text-white"
                  >
                    <Icon size={21} />
                  </motion.div>
                </div>

                <h3 className="mt-6 text-xl font-bold text-[#0B2F1A] sm:text-2xl">
                  {role.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#0B2F1A]/50">
                  {role.description}
                </p>

                {/* Tags */}

                <div className="mt-6 flex flex-wrap gap-2">
                  {role.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#F4F8F5] px-3 py-1.5 text-[11px] font-medium text-[#0B2F1A]/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover accent */}

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#1F7A4D] transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Volunteer / final-mile highlight */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.75,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-5 overflow-hidden rounded-[1.75rem] bg-[#0B2F1A] text-white shadow-[0_15px_45px_rgba(11,47,26,0.10)] sm:mt-6 sm:rounded-[2rem]"
        >
          <div className="grid lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="p-6 sm:p-8 md:p-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#A7D7B8] sm:h-11 sm:w-11">
                  <Truck size={19} />
                </div>

                <span className="text-sm font-semibold text-[#A7D7B8]">
                  Powered by community
                </span>
              </div>

              <h3 className="mt-5 max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">
                Good food should not get stuck on the way.
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
                Volunteers help close the final-mile gap by
                supporting pickup and delivery, helping rescued food
                reach its destination while it is still useful.
              </p>
            </div>

            <div className="border-t border-white/10 p-6 sm:p-8 md:p-10 lg:border-l lg:border-t-0">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <MapPin
                    size={22}
                    className="text-[#A7D7B8]"
                  />
                </div>

                <div>
                  <p className="text-2xl font-bold">Local</p>

                  <p className="text-sm text-white/40">
                    Pickup & delivery network
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Closing statement */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: 0.15,
          }}
          className="mt-8 flex items-center justify-center gap-2 px-4 text-center text-xs text-[#0B2F1A]/35 sm:mt-10 sm:text-sm"
        >
          <HeartHandshake
            size={16}
            className="shrink-0 text-[#1F7A4D]"
          />

          <span>
            Together, we turn surplus into something that matters.
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================
   FLOW NODE
========================= */

function FlowNode({
  icon: Icon,
  label,
  title,
  description,
  delay,
  highlighted = false,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.94,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: highlighted ? -3 : -2,
        transition: {
          duration: 0.2,
        },
      }}
      className={`relative z-10 rounded-3xl p-5 text-center sm:p-6 ${
        highlighted
          ? "bg-[#1F7A4D] text-white shadow-xl shadow-[#1F7A4D]/20"
          : "border border-[#0B2F1A]/8 bg-[#F7FAF8]"
      }`}
    >
      <motion.div
        animate={
          highlighted
            ? {
                y: [0, -5, 0],
              }
            : undefined
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
          highlighted
            ? "bg-white/10 text-[#A7D7B8]"
            : "bg-[#1F7A4D]/10 text-[#1F7A4D]"
        }`}
      >
        <Icon size={23} />
      </motion.div>

      <p
        className={`mt-5 text-[10px] font-bold tracking-[0.2em] ${
          highlighted
            ? "text-[#A7D7B8]"
            : "text-[#1F7A4D]"
        }`}
      >
        {label}
      </p>

      <h3 className="mt-2 text-lg font-bold sm:text-xl">
        {title}
      </h3>

      <p
        className={`mt-2 text-sm ${
          highlighted
            ? "text-white/55"
            : "text-[#0B2F1A]/40"
        }`}
      >
        {description}
      </p>
    </motion.div>
  );
}

export default EcosystemSection;