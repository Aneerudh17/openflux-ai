import { Button } from "@/components/ui/button";
import Constants from "@/data/Constants";
import { Code } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function DesignCard({ item }: any) {

  // Find model info from constants
  const modelObj = Constants.AiModelList.find(
    (model) => model.name === item?.model
  );

  return (
    <div className="p-5 border rounded-lg">

      {/* Wireframe preview */}
      <Image
        src={item?.imageUrl ?? "/placeholder.png"}
        alt="wireframe"
        width={300}
        height={200}
        className="w-full h-[200px] object-cover bg-muted rounded-lg"
      />

      <div className="mt-2">

        {/* Description */}
        <h2 className="line-clamp-3 text-muted-foreground text-sm">
          {item?.description}
        </h2>

        <div className="flex justify-between items-center mt-4">

          {/* Model badge */}
          <div className="flex items-center gap-2 p-2 bg-secondary rounded-full">

            {modelObj?.icon && (
              <Image
                src={modelObj.icon}
                alt={modelObj.name}
                width={30}
                height={30}
              />
            )}

            <h2 className="text-sm font-medium">
              {modelObj?.name ?? item?.model ?? "Unknown Model"}
            </h2>

          </div>

          {/* View code button */}
          <Link href={`/view-code/${item?.uid}`}>
            <Button>
              <Code className="mr-2 h-4 w-4" />
              View Code
            </Button>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default DesignCard;