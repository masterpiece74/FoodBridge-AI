import { motion } from "framer-motion";
import {
  ArrowRight,
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
    label: "DONORS",
    title: "Those with surplus.",
    description:
      "Restaurants, hotels, supermarkets, event organizers, and individuals can give surplus food another destination.",
    examples: "Restaurants / Supermarkets / Events",
  },
  {
    number: "02",
    icon: HeartHandshake,
    label: "RECIPIENTS",
    title: "Those with a need.",
    description:
      "Verified NGOs and community organizations receive food based on their needs, location, and capacity.",
    examples: "NGOs / Shelters / Communities",
  },
  {
    number: "03",
    icon: Truck,
    label: "VOLUNTEERS",
    title: "Those who move it.",
    description:
      "Volunteers help close the distance between available food and the communities waiting to receive it.",
    examples: "Pickup / Delivery / Support",
  },
];

function EcosystemSection() {
  return (
    <section
      id="ecosystem"
      className="scroll-mt-20 border-b border-line bg-paper"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="grid border-b border-line lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-line px-6 py-10 md:px-10 lg:border-b-0 lg:border-r lg:px-12">
            <p className="fb-label text-green">05 — Ecosystem</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="px-6 py-12 md:px-10 md:py-16 lg:px-12 lg:py-20"
          >
            <h2 className="fb-heading max-w-5xl">
              ONE NETWORK.
              <br />
              <span className="text-green">MANY HANDS.</span>
            </h2>

            <p className="mt-10 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
              FoodBridge brings different parts of the food ecosystem together
              so surplus can move from where it exists to where it is needed.
            </p>
          </motion.div>
        </div>

        {/* Network flow */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="border-b border-line"
        >
          <div className="grid md:grid-cols-3">
            <FlowNode
              number="01"
              icon={Utensils}
              label="SURPLUS"
              title="Food enters."
              description="Available food is listed by a donor."
            />

            <FlowNode
              number="02"
              icon={PackageCheck}
              label="CONNECTION"
              title="Needs align."
              description="FoodBridge identifies a suitable destination."
              highlighted
            />

            <FlowNode
              number="03"
              icon={HeartHandshake}
              label="COMMUNITY"
              title="Food arrives."
              description="A verified recipient receives the donation."
            />
          </div>
        </motion.div>

        {/* Roles */}
        <div className="grid md:grid-cols-3">
          {roles.map((role, index) => {
            const Icon = role.icon;

            return (
              <motion.article
                key={role.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className={`group min-h-[390px] px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14 ${
                  index > 0
                    ? "border-t border-line md:border-l md:border-t-0"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[clamp(3rem,5vw,5rem)] font-normal leading-none tracking-[-0.06em] text-ash transition-colors duration-300 group-hover:text-green">
                    {role.number}
                  </span>

                  <Icon
                    size={27}
                    strokeWidth={1.2}
                    className="text-ink transition-colors duration-300 group-hover:text-green"
                  />
                </div>

                <p className="fb-label mt-16 text-green">{role.label}</p>

                <h3 className="mt-4 max-w-sm text-2xl font-normal leading-tight tracking-[-0.03em] md:text-3xl">
                  {role.title}
                </h3>

                <p className="mt-5 max-w-md text-sm leading-6 text-muted md:text-base md:leading-7">
                  {role.description}
                </p>

                <div className="mt-8 border-t border-line pt-4">
                  <p className="text-[10px] uppercase tracking-[0.08em] text-muted">
                    {role.examples}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.08em] text-muted transition-all duration-300 group-hover:gap-5 group-hover:text-green">
                  <span>Join the network</span>
                  <ArrowRight size={14} strokeWidth={1.2} />
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Final-mile section */}
        <div className="grid border-t border-line lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-line px-6 py-10 md:px-10 lg:border-b-0 lg:border-r lg:px-12">
            <div className="flex items-center gap-3">
              <Truck
                size={18}
                strokeWidth={1.2}
                className="text-green"
              />

              <p className="fb-label text-muted">
                The final mile
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="px-6 py-12 md:px-10 lg:px-12 lg:py-16"
          >
            <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <h3 className="max-w-3xl text-[clamp(2.3rem,5vw,5rem)] font-normal leading-[0.95] tracking-[-0.045em]">
                  GOOD FOOD
                  <br />
                  SHOULD <span className="text-green">MOVE.</span>
                </h3>

                <p className="mt-8 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
                  Volunteers help bridge the final distance, supporting
                  pickup and delivery so rescued food can reach its intended
                  destination while it is still useful.
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-line pt-5 md:border-t-0 md:border-l md:pl-8 md:pt-0">
                <MapPin
                  size={24}
                  strokeWidth={1.2}
                  className="text-green"
                />

                <div>
                  <p className="text-xl font-normal tracking-[-0.03em]">
                    Local
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-muted">
                    Pickup & delivery
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Closing line */}
        <div className="flex items-center justify-between border-t border-line px-6 py-6 md:px-10 lg:px-12">
          <div className="flex items-center gap-3">
            <Users
              size={15}
              strokeWidth={1.2}
              className="text-green"
            />

            <p className="text-[11px] uppercase tracking-[0.08em] text-muted">
              Built together
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.08em] text-muted">
            <span className="hidden sm:block">
              Surplus → Connection → Community
            </span>

            <ArrowRight
              size={14}
              strokeWidth={1.2}
              className="text-green"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowNode({
  number,
  icon: Icon,
  label,
  title,
  description,
  highlighted = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className={`relative px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14 ${
        highlighted
          ? "border-y border-line bg-deep-green text-white md:border-x md:border-y-0"
          : "border-t border-line md:border-t-0"
      }`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`text-[clamp(3rem,5vw,5rem)] font-normal leading-none tracking-[-0.06em] ${
            highlighted ? "text-white/30" : "text-ash"
          }`}
        >
          {number}
        </span>

        <Icon
          size={27}
          strokeWidth={1.2}
          className={highlighted ? "text-light-green" : "text-green"}
        />
      </div>

      <p
        className={`fb-label mt-14 ${
          highlighted ? "text-light-green" : "text-green"
        }`}
      >
        {label}
      </p>

      <h3 className="mt-4 text-2xl font-normal tracking-[-0.03em] md:text-3xl">
        {title}
      </h3>

      <p
        className={`mt-4 max-w-xs text-sm leading-6 md:text-base md:leading-7 ${
          highlighted ? "text-white/60" : "text-muted"
        }`}
      >
        {description}
      </p>
    </motion.div>
  );
}

export default EcosystemSection;
